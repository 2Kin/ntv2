<?php
namespace NinjaTooken\UserBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use NinjaTooken\UserBundle\Entity\User;
 
class FriendRepository extends EntityRepository
{
    public function getFriends(User $user, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('f')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = true')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->addOrderBy('f.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return new Paginator($query);
    }

    public function getDemandes(User $user, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('f')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = false')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->addOrderBy('f.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return new Paginator($query);
    }

    public function getNumFriends(User $user)
    {
        $query = $this->createQueryBuilder('f')
            ->select('COUNT(f)')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = true')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->getQuery();

        return $query->getSingleScalarResult();
    }

    public function getNumDemandes(User $user)
    {

        $query = $this->createQueryBuilder('f')
            ->select('COUNT(f)')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = false')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->getQuery();

        return $query->getSingleScalarResult();
    }

    public function getNumBlocked(User $user)
    {

        $query = $this->createQueryBuilder('f')
            ->select('COUNT(f)')
            ->where('f.user = :user')
            ->andWhere('f.isBlocked = true')
            ->setParameter('user', $user)
            ->getQuery();

        return $query->getSingleScalarResult();
    }

    public function getBlocked(User $user, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('f')
            ->where('f.user = :user')
            ->andWhere('f.isBlocked = true')
            ->setParameter('user', $user)
            ->addOrderBy('f.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return new Paginator($query);
    }

    public function deleteAllBlocked(User $user = null)
    {
        if($user){
            $query = $this->createQueryBuilder('f')
                ->delete('NinjaTookenUserBundle:Friend', 'f')
                ->where('f.user = :user')
                ->andWhere('f.isBlocked = true')
                ->setParameter('user', $user)
                ->getQuery();
     
            return 1 === $query->getScalarResult();
        }
        return false;
    }

    public function deleteAllDemandes(User $user = null)
    {
        if($user){
            $query = $this->createQueryBuilder('f')
                ->delete('NinjaTookenUserBundle:Friend', 'f')
                ->where('f.user = :user')
                ->andWhere('f.isConfirmed = false')
                ->setParameter('user', $user)
                ->getQuery();
     
            return 1 === $query->getScalarResult();
        }
        return false;
    }
}