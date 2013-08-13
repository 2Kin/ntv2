<?php
namespace NinjaTooken\ClanBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use NinjaTooken\ClanBundle\Entity\Clan;
use NinjaTooken\UserBundle\Entity\User;
 
class ClanUtilisateurRepository extends EntityRepository
{
    public function getMembres(Clan $clan=null, $droit="", User $recruteur=null, $nombreParPage=20, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('cu');

        if(isset($clan)){
            $query->where('cu.clan = :clan')
                ->setParameter('clan', $clan);
        }
        if(!empty($droit)){
            $query->andWhere('cu.droit = :droit')
                ->setParameter('droit', $droit);
        }
        if(isset($recruteur)){
            $query->where('cu.recruteur = :recruteur')
                ->andWhere('cu.membre <> :recruteur')
                ->setParameter('recruteur', $recruteur);
        }

        $query->orderBy('cu.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return $query->getQuery()->getResult();
    }
}