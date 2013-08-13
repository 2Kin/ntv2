<?php
namespace NinjaTooken\GameBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use NinjaTooken\GameBundle\Entity\Ninja;
 
class NinjaRepository extends EntityRepository
{
    public function getNinjas($order="experience", $filter="", $nombreParPage=5, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('n');

        if($order=="experience")
            $query->orderBy('n.experience', 'DESC');
        elseif($order=="assassinnat")
            $query->orderBy('n.missionAssassinnat', 'DESC');
        elseif($order=="course")
            $query->orderBy('n.missionCourse', 'DESC');

        if(!empty($filter)){
            $query->where('n.classe = :classe')
                ->setParameter('classe', $filter);
        }

        $query->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return $query->getQuery()->getResult();
    }

    public function getNumNinjas($classe="")
    {
        $query = $this->createQueryBuilder('n')
            ->select('COUNT(n)');

        if(!empty($classe)){
            $query->where('n.classe = :classe')
                ->setParameter('classe', $classe);
        }

        return $query->getQuery()->getSingleScalarResult();
    }

    public function getSumExperience()
    {
        $query = $this->createQueryBuilder('n')
            ->select('SUM(n.experience)');

        return $query->getQuery()->getSingleScalarResult();
    }
}