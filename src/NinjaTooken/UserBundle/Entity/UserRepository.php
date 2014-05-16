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

    public function getMultiAccount($ip = "", $username = ""){

        if(empty($ip) && empty($username))
            return array();

        $ips = array();
        if(!empty($username)){
            $query = $this
                ->createQueryBuilder('u')
                ->select('ip.ip')
                ->join('u.ips', 'ip');

            if(!empty($ip)){
                $query
                    ->andWhere('ip.ip = :ip')
                    ->setParameter('ip', $ip);
            }

            if(!empty($username)){
                $query
                    ->andWhere('u.username = :username')
                    ->setParameter('username', $username);
            }

            $ips = $query->getQuery()->getResult();
            $ips = array_values($ips[0]);
        }else
            $ips = array($ip);


        $query = $this->createQueryBuilder('u')
            ->join('u.ips', 'ip')
            ->where('ip.ip IN(:ips)')
            ->setParameter('ips', $ips)
            ->orderBy('u.username', 'ASC')
            ->setFirstResult(0)
            ->setMaxResults(20);


        return $query->getQuery()->getResult();
    }

    public function getMultiAccountByUser($user = null){

        if(isset($user)){
            $query = $this
                ->createQueryBuilder('u')
                ->select('ip.ip')
                ->join('u.ips', 'ip')
                ->andWhere('u = :user')
                ->setParameter('user', $user);

            $ips = $query->getQuery()->getResult();
            if(!empty($ips)){
                $ips = array_values($ips[0]);

                $query = $this->createQueryBuilder('u')
                    ->join('u.ips', 'ip')
                    ->where('ip.ip IN(:ips)')
                    ->setParameter('ips', $ips)
                    ->orderBy('u.username', 'ASC')
                    ->setFirstResult(0)
                    ->setMaxResults(20);

                return $query->getQuery()->getResult();
            }
        }
        return array();
    }
}