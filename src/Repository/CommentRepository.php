<?php

namespace App\Repository;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Comment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Comment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Comment[]    findAll()
 * @method Comment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    // /**
    //  * @return Comment[] Returns an array of Comment objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Comment
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    /**
     * 
     * @param Card $card
     * @return Comment[]
     */
    public function findCommentByCard($card)
    {
        $qb = $this->createQueryBuilder('co')
        ->addSelect('c')
        ->join('co.card', 'c')
        ->where('co.card = :myCard')
        ->setParameter('myCard', $card)
        ->orderBy('co.createdAt', 'ASC')
        ;
    
        //cast retour de requete
        return $qb->getQuery()->getResult();
    }

    /**
     * 
     * @param Card $card
     * @param User $user 
     * @return Comment[]
     */
    public function findCommentByCardAndUser($user, $card)
    {
        $query = $this->getEntityManager()->createQuery('

            SELECT co
            FROM App\Entity\Comment co
            WHERE co.user = :user
            AND co.card = :card
        ')
        ->setParameter('card', $card)
        ->setParameter('user', $user);
        return $query->getResult(); 
    }
}
