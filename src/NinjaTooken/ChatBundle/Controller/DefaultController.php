<?php

namespace NinjaTooken\ChatBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $channelName = 'ninjatooken';

        $json_array = json_decode(@file_get_contents('https://api.twitch.tv/kraken/streams/'.$channelName, true), true);

        $twitchOnline = false;
        $channelTitle = '';
        $streamTitle = '';
        if ($json_array['stream'] != NULL) {
            $channelTitle = $json_array['stream']['channel']['display_name'];
            $streamTitle = $json_array['stream']['channel']['status'];
            $twitchOnline = true;
        }

        return $this->render('NinjaTookenChatBundle:Default:chat.html.twig', array(
            'twitchOnline' => $twitchOnline,
            'channelTitle' => $channelTitle,
            'streamTitle' => $streamTitle,
            'channelName' => $channelName
        ));
    }

    public function ajaxAction()
    {
        // Path to the chat directory:
        define('AJAX_CHAT_PATH', dirname(__FILE__).'/../AjaxChat/');
        define('AJAX_CHAT_URL', $this->getRequest()->getBasePath().'/chat/');

        // Include Class libraries:
        require(AJAX_CHAT_PATH.'lib/class/AJAXChat.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatDataBase.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatMySQLDataBase.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatMySQLQuery.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatMySQLiDataBase.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatMySQLiQuery.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatEncoding.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatString.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatFileSystem.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatHTTPHeader.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatLanguage.php');
        require(AJAX_CHAT_PATH.'lib/class/AJAXChatTemplate.php');
        require(AJAX_CHAT_PATH.'lib/class/CustomAJAXChat.php');
        require(AJAX_CHAT_PATH.'lib/class/CustomAJAXChatShoutBox.php');
        require(AJAX_CHAT_PATH.'lib/class/CustomAJAXChatInterface.php');

        // paramètres à surcharger
        $params = array(
            'dbConnection' => array(
                'host' => $this->container->getParameter('database_host'),
                'user' => $this->container->getParameter('database_user'),
                'pass' => $this->container->getParameter('database_password'),
                'name' => $this->container->getParameter('database_name'),
                'type' => null,
                'link' => null
            ),
            'langDefault' => $this->getRequest()->getLocale(),
            'styleDefault' => 'NinjaTooken',
            'defaultChannelName' => 'NinjaTooken',
            'forceAutoLogin' => true,
            'allowGuestLogins' => false,
            'chatBotName' => 'NinjaTooken',
            'userNameMaxLength' => 32,
            'defaultBanTime' => 10,
            'contentType' => 'text/html',
            'styleAvailable' => array('NinjaTooken','beige','black','grey','Oxygen','Lithium','Sulfur','Cobalt','Mercury','Uranium','Plum','prosilver','subblack2','subSilver','Core','MyBB','vBulletin'),
            'logoutData' => $this->generateUrl('ninja_tooken_homepage'),
            'loginData' => $this->generateUrl('fos_user_security_login'),
            'logsPurgeLogs' => true,
            'logsPurgeTimeDiff' => 60
        );

        // utilisateur à passer
        $userData = array();
        $securityContext = $this->container->get('security.context');
        if($securityContext->isGranted('IS_AUTHENTICATED_FULLY') || $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $securityContext->getToken()->getUser();
            $userData = array(
                'userID' => $user->getId(),
                'userName' => $user->getUsername(),
                'userRole' => $user->getRoles()
            );
        }

        // exécute le script et récupère le contenu
        // permet de pouvoir surcharger CustomAJAXChat avec le contexte Symfony
        ob_start();
        $ajaxChat = new \CustomAJAXChat($params, $userData);
        $chat = ob_get_contents();
        ob_end_clean();

        $response = new Response();
        $response->setContent($chat);
        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
}
