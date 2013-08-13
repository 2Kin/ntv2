<?php
namespace NinjaTooken\ForumBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
use NinjaTooken\ForumBundle\Entity\Forum;
 
class ForumRepository extends EntityRepository
{
    public function getForum($slug="", $type="", $nombreParPage=20, $page=1)
    {
        $page = max(1, $page);

        $query = $this->createQueryBuilder('f');

        if(!empty($type)){
            $query->where('f.type = :type')
                ->setParameter('type', $type);
        }
        if(!empty($slug)){
            $query->andWhere('f.slug = :slug')
            ->setParameter('slug', $slug);
        }

        $query->orderBy('f.ordre', 'DESC')
            ->setFirstResult(($page-1) * $nombreParPage)
            ->setMaxResults($nombreParPage);

        return $query->getQuery()->getResult();
    }
}