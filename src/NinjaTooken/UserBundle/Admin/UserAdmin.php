<?php
namespace NinjaTooken\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Sonata\UserBundle\Model\UserInterface;
use Doctrine\ORM\EntityRepository;
use Sonata\AdminBundle\Admin\AdminInterface;
use Knp\Menu\ItemInterface as MenuItemInterface;

use FOS\UserBundle\Model\UserManagerInterface;

class UserAdmin extends Admin
{
    protected $formOptions = array(
        'validation_groups' => 'Profile'
    );

    /**
     * {@inheritdoc}
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('username', null, array('label' => 'Login'))
            ->add('email', null, array('label' => 'Email'))
            ->add('enabled', null, array('editable' => true, 'label' => 'Activé'))
            ->add('locked', null, array('editable' => true, 'label' => 'Verrouillé'))
            ->add('createdAt', null, array('label' => 'Créé le'))
        ;

        if ($this->isGranted('ROLE_ALLOWED_TO_SWITCH')) {
            $listMapper
                ->add('impersonating', 'string', array('template' => 'SonataUserBundle:Admin:Field/impersonating.html.twig'))
            ;
        }
    }

    /**
     * {@inheritdoc}
     */
    protected function configureDatagridFilters(DatagridMapper $filterMapper)
    {
        $filterMapper
            ->add('username', null, array('label' => 'Login'))
            ->add('locked', null, array('label' => 'Verrouillé'))
            ->add('email', null, array('label' => 'Email'))
        ;
    }

    /**
     * {@inheritdoc}
     */
    protected function configureShowFields(ShowMapper $showMapper)
    {
        $showMapper
            ->with('General')
                ->add('username')
                ->add('email')
                ->add('dateOfBirth')
                ->add('biography')
                ->add('gender')
                ->add('locale')
                ->add('timezone')
                ->add('facebookUid')
            ->end()
            ->with('Ninja')
                ->add('ninja')
            ->end()
            ->with('Security')
                ->add('token')
                ->add('autologin')
            ->end()
        ;
    }

    /**
     * {@inheritdoc}
     */
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->with('General')
                ->add('username', 'text', array(
                    'label' => 'Login'
                ))
                ->add('email', 'email', array(
                    'label' => 'Email'
                ))
                ->add('receiveNewsletter', 'choice', array(
                    'label' => 'Newsletter',
                    'multiple' => false,
                    'expanded' => true,
                    'choices'  => array(true => 'Oui', false => 'Non')
                ))
                ->setHelps(array(
                    'receiveNewsletter' => 'L\'utilisateur accepte de recevoir des newsletter',
                ))
                ->add('receiveAvertissement', 'choice', array(
                    'label' => 'Avertissements',
                    'multiple' => false,
                    'expanded' => true,
                    'choices'  => array(true => 'Oui', false => 'Non')
                ))
                ->setHelps(array(
                    'receiveAvertissement' => 'L\'utilisateur accepte de recevoir des avertissements par mail à chaque nouveau message qu\'il reçoit',
                ))
                ->add('plainPassword', 'text', array(
                    'required' => false,
                    'label' => 'Mot de passe'
                ))
                ->add('dateOfBirth', 'birthday', array(
                    'required' => false,
                    'label' => 'Date de naissance'
                 ))
                ->add('description', 'textarea', array(
                    'required' => false,
                    'label' => 'Description',
                    'attr' => array(
                        'class' => 'tinymce',
                        'tinymce'=>'{"theme":"simple"}'
                    )
                ))
                ->add('gender', 'choice', array(
                    'choices' => array('m' => 'male', 'f' => 'female'),
                    'required' => false,
                    'translation_domain' => $this->getTranslationDomain(),
                    'label' => 'Sexe'
                ))
                ->add('locale', 'locale', array(
                    'required' => false,
                    'label' => 'Langue'
                 ))
                ->add('timezone', 'timezone', array(
                    'required' => false,
                    'label' => 'Fuseau horaire'
                 ))
                ->add('facebookUid', 'text', array(
                    'required' => false,
                    'label' => 'Id Facebook'
                ))
            ->end()
            ->with('Ninja')
                ->add('ninja', 'sonata_type_admin', array('label' => false), array('edit' => 'inline'))
            ->end()
            ->with('IP')
                ->add('ips', 'sonata_type_collection', array(
                    'type_options' => array('delete' => false, 'read_only' => true),
                    'by_reference' => false,
                    'label' => false
                ), array(
                    'edit' => 'inline',
                    'inline' => 'table'
                ))
            ->end()
        ;

        if ($this->getSubject() && !$this->getSubject()->hasRole('ROLE_SUPER_ADMIN')) {
            $formMapper
                ->with('Management')
                    ->add('realRoles', 'sonata_security_roles', array(
                        'expanded' => true,
                        'multiple' => true,
                        'required' => false
                    ))
                    ->add('locked', null, array('required' => false))
                    ->add('expired', null, array('required' => false))
                    ->add('enabled', null, array('required' => false))
                    ->add('credentialsExpired', null, array('required' => false))
                ->end()
            ;
        }

        $formMapper
            ->with('Sécurité')
                ->add('token', 'text', array('required' => false))
                ->add('autologin', 'text', array('required' => false))
            ->end()
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function preUpdate($user)
    {
        if(!isset($this->userManager))
            return;
        $this->getUserManager()->updateCanonicalFields($user);
        $this->getUserManager()->updatePassword($user);
    }

    /**
     * {@inheritdoc}
     */
    public function preRemove($object=null)
    {
        if(!isset($this->userManager))
            return;
        $em = $this->userManager->getManager();
        $conn = $em->getConnection();
        $evm = $em->getEventManager();

        // enlève les évènement sur clan_proposition
        // on évite d'envoyer des messages qui seront supprimés
        $evm->removeEventListener(array('postRemove'), $this->get('ninjatooken_clan.clan_proposition_listener'));

        // enlève les évènement sur thread et comment
        // tout sera remis à plat à la fin
        $evm->removeEventListener(array('postRemove'), $this->get('ninjatooken_forum.thread_listener'));
        $evm->removeEventListener(array('postRemove'), $this->get('ninjatooken_forum.comment_listener'));
    }

    /**
     * {@inheritdoc}
     */
    public function postRemove($object=null)
    {
        // recalcul les nombres de réponses d'un thread
        $conn->executeUpdate("UPDATE nt_thread as t LEFT JOIN (SELECT COUNT(nt_comment.id) as num, thread_id FROM nt_comment GROUP BY thread_id) c ON c.thread_id=t.id SET t.num_comments = c.num");
        // recalcul les nombres de réponses d'un forum
        $conn->executeUpdate("UPDATE nt_forum as f LEFT JOIN (SELECT COUNT(nt_thread.id) as num, forum_id FROM nt_thread GROUP BY forum_id) t ON t.forum_id=f.id SET f.num_threads = t.num");

        // ré-affecte les derniers commentaires
        $conn->executeUpdate("UPDATE nt_thread as t LEFT JOIN (SELECT MAX(date_ajout) as lastAt, thread_id FROM nt_comment GROUP BY thread_id) c ON c.thread_id=t.id SET t.last_comment_at = c.lastAt");
        $conn->executeUpdate("UPDATE nt_thread as t LEFT JOIN (SELECT author_id as lastBy, thread_id, date_ajout FROM nt_comment as ct) c ON c.thread_id=t.id and c.date_ajout=t.last_comment_at SET t.lastCommentBy_id = c.lastBy");
        $conn->executeUpdate("UPDATE nt_thread as t SET t.last_comment_at=t.date_ajout WHERE t.last_comment_at IS NULL");
    }

    /**
     * @param UserManagerInterface $userManager
     */
    public function setUserManager(UserManagerInterface $userManager)
    {
        $this->userManager = $userManager;
    }

    /**
     * @return UserManagerInterface
     */
    public function getUserManager()
    {
        return $this->userManager;
    }

    /**
    * {@inheritdoc}
    */
    protected function configureSideMenu(MenuItemInterface $menu, $action, AdminInterface $childAdmin = null)
    {
        if (!$childAdmin && !in_array($action, array('edit'))) {
            return;
        }

        $admin = $this->isChild() ? $this->getParent() : $this;

        $id = $admin->getRequest()->get('id');
        $menu->addChild(
            'Utilisateur',
            array('uri' => $admin->generateUrl('edit', array('id' => $id)))
        );

        $menu->addChild(
            'Messages (messagerie)',
            array('uri' => $admin->generateUrl('ninja_tooken_user.admin.message.list', array('id' => $id)))
        );

        $menu->addChild(
            'Messages (forum)',
            array('uri' => $admin->generateUrl('ninjatooken.forum.admin.comment_user.list', array('id' => $id)))
        );

        $menu->addChild(
            'Amis',
            array('uri' => $admin->generateUrl('ninja_tooken_user.admin.friend.list', array('id' => $id)))
        );

        $menu->addChild(
            'Captures',
            array('uri' => $admin->generateUrl('ninja_tooken_user.admin.capture.list', array('id' => $id)))
        );

        $menu->addChild(
            'Recrutements',
            array('uri' => $admin->generateUrl('ninja_tooken_clan.admin.clan_proposition.list', array('id' => $id)))
        );

    }
}
