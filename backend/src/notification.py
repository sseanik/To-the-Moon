from time import sleep
from json import dumps
from flask_restx import Namespace, Resource, abort
from flask_mail import Mail, Message
from flask import request, Response, render_template, current_app
from token_util import get_id_from_token
from database import create_DB_connection
from news import get_portfolio_news
from portfolio import get_portfolio_performance
from psycopg2.extras import RealDictCursor


NOTIFICATION_NS = Namespace("notification", "Email notification service")


def send_news_email(app):
    # Delay the initial Portfolio/News email by 1 minute
    sleep(60)
    initial = True
    # Work as an infinite loop, updating daily
    while True:
        # Sleep for 1 day
        if not initial:
            sleep(86400)
        with app.app_context():
            # Connect to the Database
            conn = create_DB_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            # Get all unique stock tickers
            select_query = """
                SELECT JSON_AGG(DISTINCT h.stock_ticker) as tickers
                FROM holdings h
            """.replace(
                "\n", ""
            )
            cur.execute(select_query)
            news_data = cur.fetchall()[0]

            # Get all news articles for stock tickers found
            news_articles = get_portfolio_news(news_data["tickers"], 1)

            # Fetch all portfolio data from every user that has notifications on
            portfolio_query = """
                SELECT u.email, u.id as user_id, u.notification,
                JSON_AGG(DISTINCT h.portfolio_name) AS portfolios, 
                JSON_AGG(DISTINCT h.stock_ticker) AS stocks
                FROM holdings h
                JOIN users u ON (u.id = h.user_id)
                WHERE u.notification = True
                GROUP BY u.email, u.id
            """.replace(
                "\n", ""
            )
            cur.execute(portfolio_query)
            portfolio_data = cur.fetchall()

            # For each user
            for user_data in portfolio_data:
                # Grab their email and user_id
                email = user_data["email"]
                user_id = user_data["user_id"]

                # Create a dynamic entry in the email template
                overall_portfolio_html = ""
                for portfolio in user_data["portfolios"]:
                    # Get all performance performance for each stock and the overall portfolio
                    performance = get_portfolio_performance(user_id, portfolio)

                    # Portfolio name heading
                    overall_portfolio_html += f"""
                        <div style="font-size:14pt">{portfolio}:</div>
                    """
                    # For each stock in the portfolio
                    for stock_data in performance["data"]["investments"]:
                        # Convert the total change into a 2 decimal number
                        num_total_change = round(float(stock_data["total_change"]), 2)
                        # Convert to green and add a plus symbol if positive, otherwise red and minus symbol
                        color = "green" if num_total_change > 0 else "red"
                        symbol = "+" if num_total_change > 0 else ""

                        # Add the dynamic stock html portfolio entry
                        stock_html = f"""
                            <div style="font-size:11pt">
                                <span>{stock_data["num_shares"]}x <b>{stock_data["stock_ticker"]}</b> share(s) with a total change of: </span>
                                <span style="color:{color};"><b>{symbol}{num_total_change}%</b></span>
                            </div>
                        """.replace(
                            "\n", ""
                        )
                        overall_portfolio_html += stock_html

                    # Add a dynamic overall stock performance entry
                    num_portfolio_change = round(
                        float(performance["data"]["portfolio_change"]), 2
                    )
                    overall_color = "green" if num_portfolio_change > 0 else "red"
                    overall_symbol = "+" if num_portfolio_change > 0 else ""
                    overall_portfolio_html += f"""
                        <div style="font-size:12pt;font-weight:500;margin-bottom:10px;">
                            <span>Total Portfolio Performance Change: </span>
                            <span style="color:{overall_color};">{overall_symbol}{num_portfolio_change}%</span>
                        </div>
                    """

                # Generate dynamic news html entries
                overall_news_html = ""
                for stock in user_data["stocks"]:
                    # Find the relevant news article by index
                    stock_news = news_articles["articles"][
                        news_data["tickers"].index(stock)
                    ]
                    news_html = f"""
                        <div style="display:flex;padding-bottom:10px;">
                            <img src="{stock_news['image']}"
                                style="width:150px;object-fit: contain;padding-right:15px;" />
                            <div>
                                <div><a style="margin:0;font-size: 13pt;font-weight:bold;" href="{stock_news['url']}">{stock_news['headline']}</a></div>
                                <div><p style="font-size: 11pt;margin:0;padding-bottom:10px;color:#00000;">{stock_news['summary']}</p></div>
                            </div>
                        </div>
                    """.replace(
                        "\n", ""
                    )

                    overall_news_html += news_html

                # Send the Email to the portfolio user
                message = Message(
                    "To the Moon - Portfolio and News Update",
                    sender=app.config.get("MAIL_USERNAME"),
                    recipients=[email],
                )
                # Render the dynamic template
                message.html = render_template(
                    "news.html",
                    name="Portfolio and News Update",
                    portfolio=overall_portfolio_html,
                    news=overall_news_html,
                    user_id=user_id,
                )
                app.MAIL.send(message)
                print("Portfolio/News email successfully sent")
            initial = False


def send_async_register_email(app, email, first_name, last_name, username, user_id):
    # Send a register email to the user
    with app.app_context():
        message = Message(
            "To the Moon - Successfully Registered",
            sender=app.config.get("MAIL_USERNAME"),
            recipients=[email],
        )
        message.html = render_template(
            "register.html",
            name="Reset Password",
            first_name=first_name,
            last_name=last_name,
            username=username,
            user_id=user_id,
        )
        app.MAIL.send(message)
        print("Register email successfully sent")


def send_async_reply_email(app, stock_ticker, reply_id, reply_username, reply_content):

    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    select_query = """
        SELECT u.email, u.id as user_id, u.notification,
        s.username as parent_name, c.content as parent_comment
        FROM forum_comment c
        JOIN forum_reply r ON (r.comment_id = c.comment_id)
        JOIN users u ON (r.author_id = u.id)
        JOIN users s ON (c.author_id = s.id)
        WHERE r.reply_id = %s
    """.replace(
        "\n", ""
    )

    cur.execute(select_query, (reply_id,))
    data = cur.fetchall()[0]

    cur.close()
    conn.close()

    # If the parent comment user has notifications on
    if data["notification"]:
        with app.app_context():
            message = Message(
                f"To the Moon - New Reply at {stock_ticker} forum",
                sender=app.config.get("MAIL_USERNAME"),
                recipients=[data["email"]],
            )
            # Send the parent comment user and comment and reply commenter information
            message.html = render_template(
                "reply.html",
                name="Reply Notification",
                stock_symbol=stock_ticker,
                parent_name=data["parent_name"],
                parent_comment=data["parent_comment"],
                child_name=reply_username,
                child_comment=reply_content,
                user_id=data["user_id"],
            )
            app.MAIL.send(message)
            print("Forum email successfully sent")


def unsubscribe(user_id):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    select_query = "SELECT notification FROM users WHERE id = %s"
    try:
        cur.execute(select_query, (user_id,))
        data = cur.fetchall()
        # Check if user exists
        if len(data) != 1:
            result, status = (
                "Unsubscribing Failed. Provided user ID does not exist",
                404,
            )
        else:
            # Check if user is still subscribed
            if not data[0]["notification"]:
                result, status = (
                    "Unsubscribing Failed. User is already unsubscribed",
                    400,
                )
            else:
                # Change the notification setting for a user
                update_query = "UPDATE users SET notification = %s WHERE id = %s"
                cur.execute(
                    update_query,
                    (
                        False,
                        user_id,
                    ),
                )
                conn.commit()
                result, status = (
                    "Successfully Unsubscribed from Email Notifications",
                    200,
                )
    except:
        result, status = "Unsubscribing Failed. Invalid User ID was provided", 400

    cur.close()
    conn.close()

    return result, status


@NOTIFICATION_NS.route("/unsubscribe/<string:user_id>")
class Unsubscribe(Resource):
    @NOTIFICATION_NS.doc(description="Unsubscribe from notification emails.")
    @NOTIFICATION_NS.response(200, "Successfully Unsubscribed")
    @NOTIFICATION_NS.response(400, "Invalid User ID was provided")
    @NOTIFICATION_NS.response(404, "User has already been unsubscribed")
    def get(self, user_id):
        # Endpoint to unsubscribe a user from email notifications
        result, status = unsubscribe(user_id)
        return Response(result, status=status)
