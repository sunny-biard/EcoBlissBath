<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class ProductsController extends AbstractController
{
    #[Route('/products', name: 'get_products', methods: ['GET'])]
    public function getProducts(ProductRepository $productRepository): JsonResponse
    {
        return $this->json($productRepository->findAll());
    }

    #[Route('/products/random', name: 'get_random_products', methods: ['GET'])]
    public function getRandomProducts(ProductRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findAll();
        shuffle($products);

        return $this->json(array_values(array_slice($products, 0, 3)));
    }

    #[Route('/products/{id}', name: 'get_product', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getProduct(ProductRepository $productRepository, int $id): JsonResponse
    {
        $product = $productRepository->find($id);

        if(is_null($product)) {
            throw new NotFoundHttpException();
        }
        return $this->json($product);
    }
}
