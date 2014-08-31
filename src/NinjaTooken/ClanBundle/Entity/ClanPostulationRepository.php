<?php
namespace NinjaTooken\ClanBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use NinjaTooken\ClanBundle\Entity\Clan;
use NinjaTooken\UserBundle\Entity\User;
 
class ClanPostulationRepository extends EntityRepository
{

    public function getByClanUser(Clan $clan=null, User $user=null)
    {
        $query = $this->createQueryBuilder('cp');

        if(isset($clan)){
            $query->where('cp.clan = :clan')
                ->setParameter('clan', $clan);
        }
        if(isset($user)){
            $query->andWhere('cp.postulant = :user')
                ->setParameter('user', $user);
        }
        $query->setMaxResults(1);

        return $query->getQuery()->getOneOrNullResult();
    }

    public function getByUser(User $user=null)
    {

        if(isset($user)){
            $query = $this->createQueryBuilder('cp');
            $query->andWhere('cp.postulant = :user')
                ->setParameter('user', $user);
            return $query->getQuery()->getResult();
        }
        return null;
    }

    public function getByClan(Clan $clan=null)
    {

        if(isset($clan)){
            $query = $this->createQueryBuilder('cp');
            $query->where('cp.clan = :clan')
                ->setParameter('clan', $clan);

            return $query->getQuery()->getResult();
        }
        return null;
    }
}