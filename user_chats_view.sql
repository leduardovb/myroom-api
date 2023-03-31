CREATE VIEW user_chats
AS
SELECT DISTINCT
	sender_id  as "senderId",
	recipient_id  as "recipientId",
	(
		SELECT
			usm.message
		FROM
			user_messages usm
		WHERE
			usm.sender_id = um.sender_id AND usm.recipient_id  = um.recipient_id 
			AND usm.created_at  = (SELECT MAX(usms.created_at) FROM "user_messages" usms WHERE usm.sender_id = usms.sender_id AND usm.recipient_id = usms.recipient_id)
	) AS "lastMessage"
FROM
	"user_messages" um