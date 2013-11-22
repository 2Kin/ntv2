<?php
namespace NinjaTooken\GameBundle\Entity;
 
use Doctrine\ORM\EntityRepository;
 
class LobbyRepository extends EntityRepository
{
    public function getRecent($nombre=3, $page=1)
    {
        $page = max(1, $page);

        $this->deleteOld();

        $query = $this->createQueryBuilder('a')
            ->where('a.dateUpdate>:date')
            ->setParameter('date', new \DateTime('-1 hour'))
            ->orderBy('a.dateDebut', 'DESC');

        $query->setFirstResult(($page-1) * $nombre)
            ->setMaxResults($nombre);

        return $query->getQuery()->getResult();
    }

    public function deleteOld()
    {
        $query = $this->createQueryBuilder('a')
            ->delete('NinjaTookenGameBundle:Lobby', 'a')
            ->where('a.dateUpdate<=:date')
            ->setParameter('date', new \DateTime('-1 hour'))
            ->getQuery();

        return 1 === $query->getScalarResult();
    }
}