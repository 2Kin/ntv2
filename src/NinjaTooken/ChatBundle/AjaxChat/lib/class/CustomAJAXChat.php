<?php
/*
 * @package AJAX_Chat
 * @author Sebastian Tschan
 * @copyright (c) Sebastian Tschan
 * @license GNU Affero General Public License
 * @link https://blueimp.net/ajax/
 */

class CustomAJAXChat extends AJAXChat {
    var $params;
    var $userData;

	public function __construct($params=array(), $userData=array()){
        $this->params = $params;
        $this->userData = $userData;

        parent::__construct();
    }

	function initConfig() {
		$config = null;
	    if (!include(AJAX_CHAT_PATH.'lib/config.php.example')) {
			echo('<strong>Error:</strong> Could not find a config.php file in "'.AJAX_CHAT_PATH.'"lib/". Check to make sure the file exists.');
			die();
		}
        $config = array_merge($config, $this->params);
		$this->_config = &$config;
    }

	// Returns an associative array containing userName, userID and userRole
	// Returns null if login is invalid
	function getValidLoginUserData() {
		if(!empty($this->userData)) {
                $userData = array();
                $userData['userID']		= $this->userData['userID'];
                $userData['userName']	= $this->trimUserName($this->userData['userName']);

                $userRole				= AJAX_CHAT_USER;
                if(in_array('ROLE_ADMIN', $this->userData['userRole']) || in_array('ROLE_SUPER_ADMIN', $this->userData['userRole']))
                    $userRole	= AJAX_CHAT_ADMIN;
                elseif(in_array('ROLE_MODERATOR', $this->userData['userRole']) || $userData['userID']==22405)
                    $userRole	= AJAX_CHAT_MODERATOR;

                // SOXSOXSOX VEUT PAS ÊTRE MODO SUR LE CHAT
                if($userData['userID']==425)
                    $userRole				= AJAX_CHAT_USER;

                $userData['userRole']	= $userRole;

                return $userData;
		}

        // Guest users:
        return $this->getGuestUser();
	}

	// Store the channels the current user has access to
	// Make sure channel names don't contain any whitespace
	function &getChannels() {
		if($this->_channels === null) {
			$this->_channels = $this->getAllChannels();
		}
		return $this->_channels;
	}

	// Store all existing channels
	// Make sure channel names don't contain any whitespace
	function &getAllChannels() {
		if($this->_allChannels === null) {
			// Get all existing channels:
			$customChannels = $this->getCustomChannels();
			
			$defaultChannelFound = false;
			
			foreach($customChannels as $key=>$value) {
				$forumName = $this->trimChannelName($value);
				
				$this->_allChannels[$forumName] = $key;
				
				if($key == $this->getConfig('defaultChannelID')) {
					$defaultChannelFound = true;
				}
			}
			
			if(!$defaultChannelFound) {
				// Add the default channel as first array element to the channel list:
				$this->_allChannels = array_merge(
					array(
						$this->trimChannelName($this->getConfig('defaultChannelName'))=>$this->getConfig('defaultChannelID')
					),
					$this->_allChannels
				);
			}
		}
		return $this->_allChannels;
	}

	function &getCustomUsers() {
        $users = array(
            array(
                'userRole' => AJAX_CHAT_GUEST,
                'userName' => null,
                'password' => null,
                'channels' => array(0)
            )
        );
        return $user;
	}
	
	function &getCustomChannels() {
		$channels = array('NinjaTooken');
		return $channels;
	}

    function parseCustomCommands($text, $textParts) {
        switch($textParts[0]) {
            // Away from keyboard message:
            case '/afk':
                $this->setUserName('/afk '.$this->getUserName());
                $this->updateOnlineList();
                $this->addInfoMessage($this->getUserName(), 'userName');
                $this->setSessionVar('AwayFromKeyboard', true);
                return true;
            default:
                   return false;
        }
    }

    function onNewMessage($text) {
        if($this->getSessionVar('AwayFromKeyboard')) {
            $this->setUserName($this->subString($this->getUserName(), 5));
            $this->updateOnlineList();
            $this->addInfoMessage($this->getUserName(), 'userName');
            $this->setSessionVar('AwayFromKeyboard', false);
        }
        return true;
    }
}
?>