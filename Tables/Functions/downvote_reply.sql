CREATE OR REPLACE FUNCTION downvote_reply(id_user UUID, id_reply UUID) RETURNS TABLE(
        reply_id UUID,
        stock_ticker VARCHAR(10),
        author_id UUID,
        time_stamp BIGINT,
        content VARCHAR(5000),
        upvote_user_ids JSON,
        downvote_user_ids JSON,
        is_edited BOOLEAN,
        comment_id UUID
    ) AS $$ BEGIN IF EXISTS (
        SELECT *
        FROM forum_reply voted
        WHERE id_user = ANY(voted.downvote_user_ids)
            AND voted.reply_id = id_reply
    ) THEN
UPDATE forum_reply
SET downvote_user_ids = array_remove(forum_reply.downvote_user_ids, id_user)
WHERE forum_reply.reply_id = id_reply;
ELSE
UPDATE forum_reply
SET downvote_user_ids = array_append(forum_reply.downvote_user_ids, id_user),
    upvote_user_ids = array_remove(forum_reply.upvote_user_ids, id_user)
WHERE forum_reply.reply_id = id_reply;
END IF;
RETURN QUERY
SELECT c.reply_id,
    c.stock_ticker,
    c.author_id,
    c.time_stamp,
    c.content,
    array_to_json(c.upvote_user_ids) AS upvote_user_ids,
    array_to_json(c.downvote_user_ids) AS downvote_user_ids,
    c.is_edited,
    c.comment_id
FROM forum_reply c
WHERE c.reply_id = id_reply;
END;
$$ LANGUAGE plpgsql;