https://github.com/FriendsOfSymfony/FOSUserBundle
https://github.com/Herzult/HerzultForumBundle
https://github.com/sonata-project/SonataAdminBundle
https://github.com/FriendsOfSymfony/FOSMessageBundle

http://www.aropupu.fi/bracket/

CREATE TABLE `session` (
    `session_id` varchar(255) NOT NULL,
    `session_value` text NOT NULL,
    `session_time` int(11) NOT NULL,
    PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;