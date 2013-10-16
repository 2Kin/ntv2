<?php
namespace NinjaTooken\UserBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use NinjaTooken\UserBundle\Util\CustomCanonicalizer;
 
class UserRepository extends EntityRepository
{
    public function findUserByOldPseudo($pseudo = "", $id = 0)
    {
        $query = $this->createQueryBuilder('u')
            ->where('u.enabled = :enabled')
            ->setParameter('enabled', true);

        if(!empty($pseudo)){
            $canonicalizer = new CustomCanonicalizer();
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

    public function searchUser($q = "", $num = 10, $allData = true)
    {
        $query = $this->createQueryBuilder('u');

        if(!$allData)
            $query->select('u.username as text, u.id');

        $query->where('u.locked = :locked')
            ->setParameter('locked', false);

        if(!empty($q)){
            $query->andWhere('u.username LIKE :q')
                ->setParameter('q', $q.'%');
        }

        $query->orderBy('u.username', 'ASC')
            ->setFirstResult(0)
            ->setMaxResults($num);

        return $query->getQuery()->getResult();
    }
}