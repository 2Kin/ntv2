<?php
namespace NinjaTooken\UserBundle\Entity;

use Sonata\UserBundle\Entity\BaseUser as BaseUser;
use Sonata\UserBundle\Model\UserInterface;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="nt_user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToMany(targetEntity="NinjaTooken\UserBundle\Entity\Group")
     * @ORM\JoinTable(name="nt_user_group",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="group_id", referencedColumnName="id")}
     * )
     */
    protected $groups;

    /**
     * @ORM\OneToOne(targetEntity="NinjaTooken\GameBundle\Entity\Ninja", mappedBy="user")
     */
    private $ninja;

    /**
     * @ORM\OneToOne(targetEntity="NinjaTooken\ClanBundle\Entity\ClanUtilisateur", mappedBy="membre", cascade={"persist", "remove"})
     */
    private $clan;

    /**
     * @ORM\OneToMany(targetEntity="NinjaTooken\ClanBundle\Entity\ClanUtilisateur", mappedBy="recruteur", cascade={"persist", "remove"})
     */
    private $recruts;

    /**
     * @var int
     *
     * @ORM\Column(name="old_id", type="integer", nullable=true)
     */
    private $old_id;

    /**
     * @Gedmo\Slug(fields={"username"})
     * @ORM\Column(length=128, unique=true)
     */
    private $slug;

    /**
    * @var string
    *
    * @ORM\Column(name="description", type="text", nullable=true)
    */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="avatar", type="string", length=255, nullable=true)
     */
    private $avatar;

    // propriété utilisé temporairement pour la suppression
    private $tempAvatar;
    public $file;

    /**
     * @var boolean
     *
     * @ORM\Column(name="receive_newsletter", type="boolean")
     */
    private $receiveNewsletter;

    /**
     * @var boolean
     *
     * @ORM\Column(name="receive_avertissement", type="boolean")
     */
    private $receiveAvertissement;

    /**
     * @var boolean
     *
     * @ORM\Column(name="use_gravatar", type="boolean")
     */
    private $useGravatar;

    /**
     * @var array
     *
     * @ORM\Column(name="old_usernames", type="array")
     */
    private $oldUsernames;

    /**
     * @var string
     *
     * @ORM\Column(name="old_usernames_canonical", type="string")
     */
    private $oldUsernamesCanonical;

    /**
     * @ORM\OneToMany(targetEntity="NinjaTooken\UserBundle\Entity\Ip", mappedBy="user", cascade={"persist", "remove"})
     */
    private $ips;

    public function __construct()
    {
        parent::__construct();

        $this->setGender(UserInterface::GENDER_MAN);
        $this->setReceiveAvertissement(false);
        $this->setReceiveNewsletter(false);
        $this->setUseGravatar(false);
        $this->oldUsernames = array();
        $this->oldUsernamesCanonical = "";
    }

    public function getAbsoluteAvatar()
    {
        return null === $this->avatar || "" === $this->avatar ? null : $this->getUploadRootDir().'/'.$this->avatar;
    }

    public function getWebAvatar()
    {
        return null === $this->avatar || "" === $this->avatar  ? null : $this->getUploadDir().'/'.$this->avatar;
    }

    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../www/'.$this->getUploadDir();
    }

    protected function getUploadDir()
    {
        return 'avatar';
    }

    /**
     * @ORM\PrePersist()
     */
    public function prePersist()
    {
        if (null !== $this->file) {
            $this->setAvatar(uniqid(mt_rand(), true).".".$this->file->guessExtension());
        }
    }

    /**
     * @ORM\PreUpdate()
     */
    public function preUpdate()
    {
        if (null !== $this->file) {
            $file = $this->id.'.'.$this->file->guessExtension();

            $fileAbsolute = $this->getUploadRootDir().$file;
            if(file_exists($fileAbsolute))
                unlink($fileAbsolute);

            $this->setAvatar($file);
        }
    }

    /**
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload()
    {
        if (null === $this->file) {
            return;
        }

        $this->file->move($this->getUploadRootDir(), $this->getAvatar());

        unset($this->file);
    }

    /**
     * @ORM\PreRemove()
     */
    public function storeFilenameForRemove()
    {
        $this->tempAvatar = $this->getAbsoluteAvatar();
    }

    /**
     * @ORM\PostRemove()
     */
    public function removeUpload()
    {
        if($this->tempAvatar && file_exists($this->tempAvatar)) {
            unlink($this->tempAvatar);
        }
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set slug
     *
     * @param string $slug
     * @return User
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug
     *
     * @return string 
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
    * Set description
    *
    * @param string $description
    * @return User
    */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
    * Get description
    *
    * @return string
    */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set avatar
     *
     * @param string $avatar
     * @return User
     */
    public function setAvatar($avatar)
    {
        $this->avatar = $avatar;

        return $this;
    }

    /**
     * Get avatar
     *
     * @return string 
     */
    public function getAvatar()
    {
        return $this->avatar;
    }

    /**
     * Returns the old user names
     *
     * @return array The usernames
     */
    public function getOldUsernames()
    {
        return array_unique($this->oldUsernames);
    }

    /**
     * Set oldUsername
     *
     * @param array $oldUsername
     * @return User
     */
    public function setOldUsernames(array $oldUsernames)
    {
        $this->oldUsernames = array();

        foreach ($oldUsernames as $oldUsername) {
            $this->addOldUsername($oldUsername);
        }

        return $this;
    }

    /**
     * add oldusername
     */
    public function addOldUsername($username)
    {
        if (!in_array($username, $this->oldUsernames, true)) {
            $this->oldUsernames[] = $username;
        }

        return $this;
    }

    /**
     * remove oldusername
     */
    public function removeOldUsername($username)
    {
        if (false !== $key = array_search(strtoupper($username), $this->oldUsernames, true)) {
            unset($this->oldUsernames[$key]);
            $this->oldUsernames = array_values($this->oldUsernames);
        }

        return $this;
    }

    /**
     * Set oldUsernamesCanonical
     *
     * @param string $oldUsernamesCanonical
     * @return User
     */
    public function setOldUsernamesCanonical($oldUsernamesCanonical)
    {
        $this->oldUsernamesCanonical = $oldUsernamesCanonical;

        return $this;
    }

    /**
     * Get oldUsernamesCanonical
     *
     * @return string 
     */
    public function getOldUsernamesCanonical()
    {
        return $this->oldUsernamesCanonical;
    }

    /**
     * Set receive_newsletter
     *
     * @param boolean $receiveNewsletter
     * @return User
     */
    public function setReceiveNewsletter($receiveNewsletter)
    {
        $this->receiveNewsletter = $receiveNewsletter;

        return $this;
    }

    /**
     * Get receive_newsletter
     *
     * @return boolean 
     */
    public function getReceiveNewsletter()
    {
        return $this->receiveNewsletter;
    }

    /**
     * Set receive_avertissement
     *
     * @param boolean $receiveAvertissement
     * @return User
     */
    public function setReceiveAvertissement($receiveAvertissement)
    {
        $this->receiveAvertissement = $receiveAvertissement;

        return $this;
    }

    /**
     * Get receive_avertissement
     *
     * @return boolean 
     */
    public function getReceiveAvertissement()
    {
        return $this->receiveAvertissement;
    }

    /**
     * Set use_gravatar
     *
     * @param boolean $useGravatar
     * @return User
     */
    public function setUseGravatar($useGravatar)
    {
        $this->useGravatar = $useGravatar;

        return $this;
    }

    /**
     * Get use_gravatar
     *
     * @return boolean 
     */
    public function getUseGravatar()
    {
        return $this->useGravatar;
    }

    /**
     * Set old_id
     *
     * @param integer $oldId
     * @return User
     */
    public function setOldId($oldId)
    {
        $this->old_id = $oldId;

        return $this;
    }

    /**
     * Get old_id
     *
     * @return integer 
     */
    public function getOldId()
    {
        return $this->old_id;
    }


    public function serialize()
    {
        return serialize(array($this->facebookUid, parent::serialize()));
    }

    public function unserialize($data)
    {
        list($this->facebookUid, $parentData) = unserialize($data);
        parent::unserialize($parentData);
    }

    /**
     * Get the full name of the user (first + last name)
     * @return string
     */
    public function getFullName()
    {
        return $this->getFirstname() . ' ' . $this->getLastname();
    }

    /**
     * @param Array
     */
    public function setFBData($fbdata)
    {
        if (isset($fbdata['id'])) {
            $this->setFacebookUid($fbdata['id']);
            $this->addRole('ROLE_FACEBOOK');
        }
        if (isset($fbdata['first_name'])) {
            $this->setFirstname($fbdata['first_name']);
        }
        if (isset($fbdata['last_name'])) {
            $this->setSurname($fbdata['last_name']);
        }
        if (isset($fbdata['email'])) {
            $this->setEmail($fbdata['email']);
        }
    }

    /**
     * Set ninja
     *
     * @param \NinjaTooken\GameBundle\Entity\Ninja $ninja
     * @return User
     */
    public function setNinja(\NinjaTooken\GameBundle\Entity\Ninja $ninja = null)
    {
        $this->ninja = $ninja;

        return $this;
    }

    /**
     * Get ninja
     *
     * @return \NinjaTooken\GameBundle\Entity\Ninja 
     */
    public function getNinja()
    {
        return $this->ninja;
    }

    /**
     * Set clan
     *
     * @param \NinjaTooken\ClanBundle\Entity\ClanUtilisateur $clan
     * @return User
     */
    public function setClan(\NinjaTooken\ClanBundle\Entity\ClanUtilisateur $clan = null)
    {
        $this->clan = $clan;

        return $this;
    }

    /**
     * Get clan
     *
     * @return \NinjaTooken\ClanBundle\Entity\ClanUtilisateur 
     */
    public function getClan()
    {
        return $this->clan;
    }

    /**
     * Add recruts
     *
     * @param \NinjaTooken\ClanBundle\Entity\ClanUtilisateur $recruts
     * @return User
     */
    public function addRecrut(\NinjaTooken\ClanBundle\Entity\ClanUtilisateur $recruts)
    {
        $this->recruts[] = $recruts;

        return $this;
    }

    /**
     * Remove recruts
     *
     * @param \NinjaTooken\ClanBundle\Entity\ClanUtilisateur $recruts
     */
    public function removeRecrut(\NinjaTooken\ClanBundle\Entity\ClanUtilisateur $recruts)
    {
        $this->recruts->removeElement($recruts);
    }

    /**
     * Get recruts
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getRecruts()
    {
        return $this->recruts;
    }

    /**
     * Add ips
     *
     * @param \NinjaTooken\UserBundle\Entity\Ip $ips
     * @return User
     */
    public function addIp(\NinjaTooken\UserBundle\Entity\Ip $ips)
    {
        $this->ips[] = $ips;

        return $this;
    }

    /**
     * Remove ips
     *
     * @param \NinjaTooken\UserBundle\Entity\Ip $ips
     */
    public function removeIp(\NinjaTooken\UserBundle\Entity\Ip $ips)
    {
        $this->ips->removeElement($ips);
    }

    /**
     * Get ips
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getIps()
    {
        return $this->ips;
    }
}
