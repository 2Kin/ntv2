<?php
namespace NinjaTooken\UserBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use NinjaTooken\UserBundle\Entity\User;
 
class MessageRepository extends EntityRepository
{
    public function getSendMessages(User $user, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('m')
            ->where('m.user = :user')
            ->andWhere('m.hasDeleted = 0')
            ->setParameter('user', $user)
            ->addOrderBy('m.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage)
            ->getQuery();

        return $query->getResult();
    }

    public function getFirstSendMessage(User $user)
    {
        $query = $this->createQueryBuilder('m')
            ->andWhere('m.user = :user')
            ->andWhere('m.hasDeleted = 0')
            ->setParameter('user', $user)
            ->addGroupBy('m.id')
            ->addOrderBy('m.dateAjout', 'DESC')
            ->setFirstResult(0)
            ->setMaxResults(1)
            ->getQuery();

        return $query->getResult();
    }

    public function getNumSendMessages(User $user)
    {
        $query = $this->createQueryBuilder('m')
            ->select('COUNT(m)')
            ->where('m.user = :user')
            ->andWhere('m.hasDeleted = 0')
            ->setParameter('user', $user)
            ->getQuery();

        return $query->getSingleScalarResult();
    }

    public function getReceiveMessages(User $user, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('m')
            ->leftJoin('m.receivers', 'mu')
            ->where('mu.user = :user')
            ->andWhere('m.user <> :user')
            ->andWhere('mu.hasDeleted = 0')
            ->setParameter('user', $user)
            ->addGroupBy('m.id')
            ->addOrderBy('m.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage)
            ->getQuery();

        return $query->getResult();
    }

    public function getFirstReceiveMessage(User $user)
    {
        $query = $this->createQueryBuilder('m')
            ->leftJoin('m.receivers', 'mu')
            ->where('mu.user = :user')
            ->andWhere('m.user <> :user')
            ->andWhere('mu.hasDeleted = 0')
            ->setParameter('user', $user)
            ->addGroupBy('m.id')
            ->addOrderBy('m.dateAjout', 'DESC')
            ->setFirstResult(0)
            ->setMaxResults(1)
            ->getQuery();

        return $query->getResult();
    }

    public function getNumReceiveMessages(User $user)
    {
        $query = $this->createQueryBuilder('m')
            ->leftJoin('m.receivers', 'mu')
            ->select('COUNT(m)')
            ->where('mu.user = :user')
            ->andWhere('m.user <> :user')
            ->andWhere('mu.hasDeleted = 0')
            ->setParameter('user', $user)
            ->getQuery();

        return $query->getSingleScalarResult();
    }

    public function getNumNewMessages(User $user)
    {
        $query = $this->createQueryBuilder('m')
            ->select('COUNT(m)')
            ->innerJoin('NinjaTookenUserBundle:MessageUser', 'mu', 'WITH', 'm.id = mu.message')
            ->where('mu.user = :user')
            ->andWhere('m.user <> :user')
            ->andWhere('mu.dateRead = :date')
            ->andWhere('mu.hasDeleted = 0')
            ->setParameter('user', $user)
            ->setParameter('date', '0000-00-00 00:00:00')
            ->getQuery();

        return $query->getSingleScalarResult();
    }
}