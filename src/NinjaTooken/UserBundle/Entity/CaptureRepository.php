<?php
namespace NinjaTooken\UserBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use NinjaTooken\UserBundle\Entity\User;
 
class CaptureRepository extends EntityRepository
{
    public function getCaptures(User $user, $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('c')
            ->where('c.user = :user')
            ->setParameter('user', $user)
            ->addOrderBy('c.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return new Paginator($query);
    }
}