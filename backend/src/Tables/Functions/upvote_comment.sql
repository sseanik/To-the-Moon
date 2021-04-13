CREATE OR REPLACE FUNCTION upvote_comment(id_user UUID, id_comment UUID) RETURNS TABLE(
		comment_id UUID,
		stock_ticker VARCHAR(10),
		author_id UUID,
		time_stamp BIGINT,
		content VARCHAR(5000),
		upvote_user_ids JSON,
		downvote_user_ids JSON,
		is_edited BOOLEAN,
		is_deleted BOOLEAN
	) AS $$ BEGIN IF EXISTS (
		SELECT *
		FROM forum_comment del
		WHERE del.comment_id = id_comment
			AND del.is_deleted = true
	) THEN RAISE EXCEPTION 'Voting is disabled for deleted comments';
END IF;
IF EXISTS (
	SELECT *
	FROM forum_comment voted
	WHERE id_user = ANY(voted.upvote_user_ids)
		AND voted.comment_id = id_comment
) THEN
UPDATE forum_comment
SET upvote_user_ids = array_remove(forum_comment.upvote_user_ids, id_user)
WHERE forum_comment.comment_id = id_comment;
ELSE
UPDATE forum_comment
SET upvote_user_ids = array_append(forum_comment.upvote_user_ids, id_user),
	downvote_user_ids = array_remove(forum_comment.downvote_user_ids, id_user)
WHERE forum_comment.comment_id = id_comment;
END IF;
RETURN QUERY
SELECT c.comment_id,
	c.stock_ticker,
	c.author_id,
	c.time_stamp,
	c.content,
	array_to_json(c.upvote_user_ids) AS upvote_user_ids,
	array_to_json(c.downvote_user_ids) AS downvote_user_ids,
	c.is_edited,
	c.is_deleted
FROM forum_comment c
WHERE c.comment_id = id_comment;
END;
$$ LANGUAGE plpgsql;