<?php

namespace App\Controller;

use App\Entity\Review;
use App\Form\ReviewType;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class ReviewsController extends AbstractController
{
    #[Route('/reviews', name: 'get_reviews', methods: ['GET'])]
    public function getReviews(ReviewRepository $reviewRepository): JsonResponse
    {
        return $this->json($reviewRepository->findBy([], ['date' => 'DESC']));
    }

    #[Route('/reviews', name: 'post_review', methods: ['POST'])]
    public function postReview(Request $request, ReviewRepository $reviewRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$this->isGranted('ROLE_USER')) {
            throw $this->createAccessDeniedException();
        }

        $data = json_decode($request->getContent(), true);

        $review = new Review();

        $form = $this->createForm(ReviewType::class, $review);

        $form->submit($data);
        if ($form->isValid()) {
            $review->setDate(new \DateTime())
                ->setAuthor($this->getUser());

            $entityManager->persist($review);
            $entityManager->flush();
        } else {
            return $this->json(['error' => $form->getErrors()], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($review);
    }
}
