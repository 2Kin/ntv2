<?php

namespace NinjaTooken\ClanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Clan
 *
 * @ORM\Table(name="nt_clan")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="NinjaTooken\ClanBundle\Entity\ClanRepository")
 */
class Clan
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="old_id", type="integer", nullable=true)
     */
    private $old_id;

    /**
     * @ORM\OneToMany(targetEntity="NinjaTooken\ClanBundle\Entity\ClanUtilisateur", mappedBy="clan", cascade={"persist", "remove"})
     */
    private $membres;

    /**
     * @ORM\OneToMany(targetEntity="NinjaTooken\ForumBundle\Entity\Forum", mappedBy="clan", cascade={"persist", "remove"})
     */
    private $forums;

    /**
     * @Gedmo\Slug(fields={"nom"})
     * @ORM\Column(length=128, unique=true)
     */
    private $slug;

    /**
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=255)
     * @Assert\Length(max=255)
     * @Assert\NotBlank()
     */
    private $nom;

    /**
     * @var string
     *
     * @ORM\Column(name="tag", type="string", length=5, nullable=true)
     * @Assert\Length(max=5)
     */
    private $tag;

    /**
     * @var string
     *
     * @ORM\Column(name="accroche", type="string", length=255, nullable=true)
     * @Assert\Length(max=255)
     */
    private $accroche;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text")
     * @Assert\NotBlank()
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="url", type="string", length=255, nullable=true)
     * @Assert\Length(max=255)
     * @Assert\Url()
     */
    private $url;

    /**
     * @var string
     *
     * @ORM\Column(name="kamon", type="string", length=255)
     * @Assert\Length(max=255)
     */
    private $kamon;

    /**
     * @var string
     *
     * @ORM\Column(name="kamon_upload", type="string", length=255, nullable=true)
     * @Assert\Image(
     *     minWidth = 50,
     *     maxWidth = 400,
     *     minHeight = 50,
     *     maxHeight = 400,
     *     mimeTypes = {"image/jpeg", "image/png", "image/gif"}
     * )
     */
    private $kamonUpload;

    // propriété utilisé temporairement pour la suppression
    private $tempKamon;
    public $file;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_ajout", type="datetime")
     */
    private $dateAjout;

    /**
     * @var boolean
     *
     * @ORM\Column(name="online", type="boolean")
     */
    private $online = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_recruting", type="boolean")
     */
    private $isRecruting = true;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->membres = new \Doctrine\Common\Collections\ArrayCollection();
        $this->forums = new \Doctrine\Common\Collections\ArrayCollection();

        $this->setDateAjout(new \DateTime());
    }

    public function __toString(){
        return $this->nom;
    }

    public function getAbsoluteKamonUpload()
    {
        return null === $this->kamonUpload || "" === $this->kamonUpload ? null : $this->getUploadRootDir().'/'.$this->kamonUpload;
    }

    public function getWebKamonUpload()
    {
        return null === $this->kamonUpload || "" === $this->kamonUpload  ? null : $this->getUploadDir().'/'.$this->kamonUpload;
    }

    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../web/'.$this->getUploadDir();
    }

    protected function getUploadDir()
    {
        return 'kamon';
    }

    /**
     * @ORM\PrePersist()
     */
    public function prePersist()
    {
        if (null !== $this->file) {
            $this->setKamonUpload(uniqid(mt_rand(), true).".".$this->file->guessExtension());
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

            $this->setKamonUpload($file);
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

        $this->file->move($this->getUploadRootDir(), $this->getKamonUpload());

        unset($this->file);
    }

    /**
     * @ORM\PreRemove()
     */
    public function storeFilenameForRemove()
    {
        $this->tempKamon = $this->getAbsoluteKamonUpload();
    }

    /**
     * @ORM\PostRemove()
     */
    public function removeUpload()
    {
        if($this->tempKamon && file_exists($this->tempKamon)) {
            unlink($this->tempKamon);
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
     * Set nom
     *
     * @param string $nom
     * @return Clan
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     *
     * @return string 
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set tag
     *
     * @param string $tag
     * @return Clan
     */
    public function setTag($tag)
    {
        $this->tag = $tag;

        return $this;
    }

    /**
     * Get tag
     *
     * @return string 
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Clan
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
     * Set accroche
     *
     * @param string $accroche
     * @return Clan
     */
    public function setAccroche($accroche)
    {
        $this->accroche = $accroche;

        return $this;
    }

    /**
     * Get accroche
     *
     * @return string 
     */
    public function getAccroche()
    {
        return $this->accroche;
    }

    /**
     * Set url
     *
     * @param string $url
     * @return Clan
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get url
     *
     * @return string 
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set kamon
     *
     * @param string $kamon
     * @return Clan
     */
    public function setKamon($kamon)
    {
        $this->kamon = $kamon;

        return $this;
    }

    /**
     * Get kamon
     *
     * @return string 
     */
    public function getKamon()
    {
        return $this->kamon;
    }

    /**
     * Set dateAjout
     *
     * @param \DateTime $dateAjout
     * @return Clan
     */
    public function setDateAjout($dateAjout)
    {
        $this->dateAjout = $dateAjout;

        return $this;
    }

    /**
     * Get dateAjout
     *
     * @return \DateTime 
     */
    public function getDateAjout()
    {
        return $this->dateAjout;
    }

    /**
     * Set online
     *
     * @param boolean $online
     * @return Clan
     */
    public function setOnline($online)
    {
        $this->online = $online;

        return $this;
    }

    /**
     * Get online
     *
     * @return boolean 
     */
    public function getOnline()
    {
        return $this->online;
    }

    /**
     * Set slug
     *
     * @param string $slug
     * @return Clan
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
     * Set old_id
     *
     * @param integer $oldId
     * @return Clan
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

    /**
     * Add membres
     *
     * @param \NinjaTooken\ClanBundle\Entity\ClanUtilisateur $membre
     * @return Clan
     */
    public function addMembre(\NinjaTooken\ClanBundle\Entity\ClanUtilisateur $membre)
    {
        $this->membres[] = $membre;
        $membre->setClan($this);

        return $this;
    }

    /**
     * Remove membres
     *
     * @param \NinjaTooken\ClanBundle\Entity\ClanUtilisateur $membre
     */
    public function removeMembre(\NinjaTooken\ClanBundle\Entity\ClanUtilisateur $membre)
    {
        $this->membres->removeElement($membre);
    }

    /**
     * Get membres
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getMembres()
    {
        return $this->membres;
    }

    /**
     * Set isRecruting
     *
     * @param boolean $isRecruting
     * @return Clan
     */
    public function setIsRecruting($isRecruting)
    {
        $this->isRecruting = $isRecruting;

        return $this;
    }

    /**
     * Get isRecruting
     *
     * @return boolean 
     */
    public function getIsRecruting()
    {
        return $this->isRecruting;
    }

    /**
     * Add forums
     *
     * @param \NinjaTooken\ForumBundle\Entity\Forum $forums
     * @return Clan
     */
    public function addForum(\NinjaTooken\ForumBundle\Entity\Forum $forums)
    {
        $this->forums[] = $forums;

        return $this;
    }

    /**
     * Remove forums
     *
     * @param \NinjaTooken\ForumBundle\Entity\Forum $forums
     */
    public function removeForum(\NinjaTooken\ForumBundle\Entity\Forum $forums)
    {
        $this->forums->removeElement($forums);
    }

    /**
     * Get forums
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getForums()
    {
        return $this->forums;
    }

    /**
     * Set avatar
     *
     * @param string $kamonUpload
     * @return Clan
     */
    public function setKamonUpload($kamonUpload)
    {
        $this->kamonUpload = $kamonUpload;

        return $this;
    }

    /**
     * Get kamonUpload
     *
     * @return string 
     */
    public function getKamonUpload()
    {
        return $this->kamonUpload;
    }
}
