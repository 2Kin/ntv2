<?php
namespace NinjaTooken\UserBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use FOS\UserBundle\Util\Canonicalizer;
 
class UserRepository extends EntityRepository
{
    public function findUserByOldPseudo($pseudo = "", $id = 0)
    {
        $query = $this->createQueryBuilder('u')
            ->where('u.enabled = :enabled')
            ->setParameter('enabled', true);

        if(!empty($pseudo)){
            $canonicalizer = new Canonicalizer();
            $pseudoCanonical = $canonicalizer->canonicalize($pseudo);

            $query->andWhere('u.oldUsernamesCanonical LIKE :pseudo')
                ->setParameter('pseudo', ','.$pseudoCanonical.',');
        }

        if(!empty($id)){
            $query->andWhere('u.id <> :id')
                ->setParameter('id', $id);
        }

        return $query->getQuery()->getOneOrNullResult();
    }

    public function searchUser($q = "", $num = 10)
    {
        $query = $this->createQueryBuilder('u')
            ->where('u.locked = :locked')
            ->setParameter('locked', false);

        if(!empty($q)){
            $query->andWhere('u.username LIKE :q')
                ->setParameter('q', $q.'%');
        }

        $query->setFirstResult(0)
            ->setMaxResults($num);

        return $query->getQuery()->getResult();
    }
}