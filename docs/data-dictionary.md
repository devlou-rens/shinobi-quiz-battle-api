# Data dictionary

Generated from the database by `npm run docs:dictionary` on 2026-11-25, then described by hand.

### `Answer`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `answerId` | integer | no | auto number | ; PK | Unique identifier for each submitted answer. |
| `playerId` | integer | no |  | ; FK FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON UPDATE CASCADE ON DELETE CASCADE | Identifies the player who submitted the answer. |
| `questionId` | integer | no |  | ; FK FOREIGN KEY ("questionId") REFERENCES "Question"("questionId") ON UPDATE CASCADE ON DELETE CASCADE | Identifies the question being answered. |
| `selectedIndex` | integer | no |  |  | Stores the index of the answer choice selected by the player. |
| `isCorrect` | boolean | no |  |  | Indicates whether the submitted answer is correct. |
| `submittedAt` | timestamp with time zone | no |  |  | Records the date and time when the answer was submitted. |

### `GameSession`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `sessionId` | integer | no | auto number | ; PK | Unique identifier for each game session. |
| `hostId` | integer | no |  | ; FK FOREIGN KEY ("hostId") REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE | Identifies the host who created the game session. |
| `questionSetId` | integer | no |  | ; FK FOREIGN KEY ("questionSetId") REFERENCES "QuestionSet"("questionSetId") ON UPDATE CASCADE ON DELETE CASCADE | Identifies the question set used for the game. |
| `joinCode` | character varying(20) | no |  |  | Stores the unique code players use to join the game. |
| `status` | character varying(20) | no |  |  | Stores the current state of the game session, such as LOBBY, RUNNING, or CLOSED. |
| `timeLimit` | integer | no |  |  | Stores the allowed game duration in seconds. |
| `startTime` | timestamp with time zone | yes |  |  | Records when the host starts the game. |
| `endTime` | timestamp with time zone | yes |  |  | Records when the game session ends or is closed. |
| `question_started_at` | timestamp with time zone | yes |  |  | Records the start time of the current question position in the session. |
| `current_position` | integer | yes |  |  | Stores the current question position used by the session. |

### `Player`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `playerId` | integer | no | auto number | ; PK | Unique identifier for each player entry in a game session. |
| `sessionId` | integer | no |  | ; FK FOREIGN KEY ("sessionId") REFERENCES "GameSession"("sessionId") ON UPDATE CASCADE ON DELETE CASCADE; UNIQUE (uq_player_session_nickname); UNIQUE (uq_player_session_user) | Identifies the game session joined by the player. |
| `user_id` | integer | no |  | ; FK REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE; UNIQUE (uq_player_session_user) | Identifies the registered user associated with the player. |
| `nickname` | character varying(50) | no |  | ; UNIQUE (uq_player_session_nickname) | Stores the nickname displayed for the player during the game. |
| `avatar` | character varying(100) | no |  |  | Stores the player's selected avatar. |
| `chakra` | integer | no | `0` |  | Stores the player's current Chakra points. |

### `PlayerQuestion`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `playerQuestionId` | integer | no | auto number | ; PK | Unique identifier for each player-question progress record. |
| `playerId` | integer | no |  | ; FK FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON UPDATE CASCADE ON DELETE CASCADE; UNIQUE (unique_player_question_progress) | Identifies the player answering the question. |
| `questionId` | integer | no |  | ; FK FOREIGN KEY ("questionId") REFERENCES "Question"("questionId") ON UPDATE CASCADE ON DELETE CASCADE; UNIQUE (unique_player_question_progress) | Identifies the question assigned to the player. |
| `questionStartedAt` | timestamp with time zone | no |  |  | Records when the player started answering the question. |
| `answeredAt` | timestamp with time zone | yes |  |  | Records when the player completed the question. A null value means the question has not been completed yet. |

### `Question`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `questionId` | integer | no | auto number | ; PK | Unique identifier for each quiz question. |
| `questionSetId` | integer | no |  | ; FK FOREIGN KEY ("questionSetId") REFERENCES "QuestionSet"("questionSetId") ON UPDATE CASCADE ON DELETE CASCADE | Identifies the question set to which the question belongs. |
| `text` | text | no |  |  | Stores the question displayed to the player. |
| `type` | character varying(30) | no |  |  | Stores the question type used by the quiz. |
| `correctIndex` | integer | no |  |  | Stores the index of the correct answer choice. |
| `timeLimit` | integer | no |  |  | Stores the time allowed to answer the question. |

### `QuestionChoice`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `choiceId` | integer | no | auto number | ; PK | Unique identifier for each answer choice. |
| `questionId` | integer | no |  | ; FK FOREIGN KEY ("questionId") REFERENCES "Question"("questionId") ON UPDATE CASCADE ON DELETE CASCADE; UNIQUE (uq_question_choice_position) | Identifies the question associated with this answer choice. |
| `choiceText` | text | no |  |  | Stores the text displayed as an answer choice. |
| `position` | integer | no |  | ; UNIQUE (uq_question_choice_position) | Stores the position of the answer choice within its question. |

### `QuestionSet`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `questionSetId` | integer | no | auto number | ; PK | Unique identifier for each question set. |
| `hostId` | integer | no |  | ; FK FOREIGN KEY ("hostId") REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE | Identifies the host who created the question set. |
| `title` | character varying(100) | no |  |  | Stores the title or name of the question set. |
| `subject` | character varying(100) | no |  |  | Stores the subject or topic covered by the questions. |
| `coverImage` | character varying(255) | yes |  |  | Stores the URL or path of the question set's cover image, if provided. |

### `RewardObject`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `rewardId` | integer | no | auto number | ; PK | Unique identifier for each reward object. |
| `rewardRoundId` | integer | no |  | ; FK FOREIGN KEY ("rewardRoundId") REFERENCES "RewardRound"("rewardRoundId") ON UPDATE CASCADE ON DELETE CASCADE | Identifies the reward round associated with the reward object. |
| `objectType` | character varying(20) | no |  |  | Stores the type of reward object, such as a balloon, chest, or bomb. |
| `chakraChange` | integer | no |  |  | Stores the number of Chakra points added or deducted by the reward object. |

### `RewardRound`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `rewardRoundId` | integer | no | auto number | ; PK | Unique identifier for each reward round. |
| `playerId` | integer | no |  | ; FK FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON UPDATE CASCADE ON DELETE CASCADE | Identifies the player who participated in the reward round. |
| `duration` | integer | no |  |  | Stores the duration of the reward activity. |
| `chakraEarned` | integer | no |  |  | Stores the total Chakra points earned or recorded during the reward round. |

### `users`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `user_id` | integer | no | auto number | ; PK | Unique identifier for each registered account. |
| `school_id` | character varying(30) | no |  | ; UNIQUE (users_school_id_key) | Stores the user's unique school identification number. |
| `full_name` | character varying(100) | no |  |  | Stores the full name of the account holder. |
| `email` | character varying(100) | no |  | ; UNIQUE (users_email_key) | Stores the user's email address. |
| `role` | character varying(20) | no |  |  | Stores the account role, such as PLAYER, HOST, or ADMIN. |
| `password_hash` | character varying(60) | yes |  |  | Stores the hashed password used for account authentication. |

