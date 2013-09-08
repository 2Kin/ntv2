<?php
namespace NinjaTooken\ClanBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use NinjaTooken\ClanBundle\Entity\Clan;
use NinjaTooken\UserBundle\Entity\User;
 
class ClanUtilisateurRepository extends EntityRepository
{
    public function getMembres(Clan $clan=null, $droit=null, User $recruteur=null, $nombreParPage=100, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('cu');

        if(isset($clan)){
            $query->where('cu.clan = :clan')
                ->setParameter('clan', $clan);
        }
        if(isset($droit)){
            $query->andWhere('cu.droit = :droit')
                ->setParameter('droit', $droit);
        }
        if(isset($recruteur)){
            $query->andWhere('cu.recruteur = :recruteur')
                ->andWhere('cu.membre <> :recruteur')
                ->setParameter('recruteur', $recruteur);
        }

        $query->orderBy('cu.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return $query->getQuery()->getResult();
    }

    public function getMembreByClanUser(Clan $clan=null, User $user=null)
    {
        $query = $this->createQueryBuilder('cu');

        if(isset($clan)){
            $query->where('cu.clan = :clan')
                ->setParameter('clan', $clan);
        }
        if(isset($user)){
            $query->andWhere('cu.membre = :user')
                ->setParameter('user', $user);
        }

        return $query->getQuery()->getOneOrNullResult();
    }

    public function removeByClan(Clan $clan = null)
    {
        if($clan){
            $query = $this->createQueryBuilder('cu')
                ->delete('NinjaTookenClanBundle:ClanUtilisateur', 'cu')
                ->where('cu.clan = :clan')
                ->setParameter('clan', $clan)
                ->getQuery();
     
            return 1 === $query->getScalarResult();
        }
        return false;
    }
}