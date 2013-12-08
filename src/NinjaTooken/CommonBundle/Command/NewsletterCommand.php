<?php
namespace NinjaTooken\CommonBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class NewsletterCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('newsletter:send')
            ->setDescription('Envoi de la newsletter')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $template = $container->get('twig')->loadTemplate('::newsletter.html.twig');
        $translator = $container->get('translator');
        $route = $container->get('router');
        $em = $container->get('doctrine')->getManager();
        $mailer = $container->get('mailer');

        $from = array($container->getParameter('mail_contact') => $container->getParameter('mail_name'));

        $output->writeln('---start');

        // boucle sur les différents utilisateurs
        $request = 'SELECT id, username, email FROM nt_user WHERE enabled=1 AND locked=0 AND receive_newsletter=1 AND confirmation_token IS NULL ORDER BY id ASC LIMIT ';
        $start = 0;
        $num = 100;
        $i = 1;
        $stmt = $em->getConnection()->prepare($request.$start.','.$num);
        $stmt->execute();
        $users = $stmt->fetchAll();
        while(count($users)>0){
            foreach($users as $user){
                $username = $user['username'];
                $email = $user['email'];
                // construit le contenu
                $body = $template->render(array(
                    'user' => $user,
                    'message' => $route->generate('ninja_tooken_homepage', array(), true)
                ));

                // envoi les messages
                /*$message = \Swift_Message::newInstance()
                    ->setSubject('[Ninjatooken] nouveau message de la part de '.$username)
                    ->setFrom($from)
                    ->setTo($email)
                    ->setContentType("text/html")
                    ->setBody($body);
                $mailer->send($message);*/

                $output->writeln($i." ".$username.' ('.$email.')');
                $i++;
            }
            $start += $num;

            // en cas de "spool", vide la queue
            // http://symfony.com/fr/doc/master/cookbook/email/spool.html
            /*$spool = $mailer->getTransport()->getSpool();
            $transport = $container->get('swiftmailer.transport.real');
            $spool->flushQueue($transport);*/
            
            $stmt = $em->getConnection()->prepare($request.$start.','.$num);
            $stmt->execute();
            $users = $stmt->fetchAll();
        }
        $output->writeln('---end');
    }
}