<?php

namespace Losofacebook\Service;
use Doctrine\DBAL\Connection;
use Imagick;
use ImagickPixel;
use Symfony\Component\HttpFoundation\Response;
use Losofacebook\Image;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Memcached;

/**
 * Image service
 */
class ImageService extends AbstractService
{
    const COMPRESSION_TYPE = Imagick::COMPRESSION_JPEG;
    
    private $versions = [
        [
            "name" => "thumb",
            "dimensions" => 153
        ],
        [
            "name" => "tinyplus",
            "dimensions" => 75
        ],
        [
            "name" => "tiny",
            "dimensions" => 50
        ],
        [
            "name" => "mini",
            "dimensions" => 20
        ],
    ];

    /**
     * @param $basePath
     */
    public function __construct(Connection $conn, $basePath, Memcached $memcached)
    {
        parent::__construct($conn, 'image', $memcached);
        $this->basePath = $basePath;
    }

    /**
     * Creates image
     *
     * @param string $path
     * @param int $type
     * @return integer
     */
    public function createImage($path, $type)
    {
        $this->conn->insert(
            'image',
            [
                'upload_path' => $path,
                'type' => $type
            ]
        );
        $id = $this->conn->lastInsertId();

        $img = new Imagick($path);
        $img->setbackgroundcolor(new ImagickPixel('white'));
        $img = $img->flattenImages();

        $img->setImageFormat("jpeg");

        $img->setImageCompression(self::COMPRESSION_TYPE);
        $img->setImageCompressionQuality(90);
        $img->scaleImage(1200, 1200, true);
        $img->writeImage($this->basePath . '/' . $id);

        if ($type == Image::TYPE_PERSON) {
            $this->createVersions($id);
        } else {
            $this->createCorporateVersions($id);
        }
        return $id;
    }


    public function createCorporateVersions($id)
    {
        $img = new Imagick($this->basePath . '/' . $id);
        $img->thumbnailimage(450, 450, true);

        $geo = $img->getImageGeometry();

        $x = (500 - $geo['width']) / 2;
        $y = (500 - $geo['height']) / 2;

        $image = new Imagick();
        $image->newImage(500, 500, new ImagickPixel('white'));
        $image->setImageFormat('jpeg');
        $image->compositeImage($img, $img->getImageCompose(), $x, $y);

        $thumb = clone $image;
        $thumb->cropThumbnailimage(500, 500);
        $thumb->setImageCompression(self::COMPRESSION_TYPE);
        $thumb->setImageCompressionQuality(90);
        $thumb->writeImage($this->basePath . '/' . $id . '-thumb');
    }


    public function createVersions($id)
    {
        $img = new Imagick($this->basePath . '/' . $id);
        
        
        $img->setImageCompression(self::COMPRESSION_TYPE);
        $img->setImageCompressionQuality(90);
        
        $img->stripimage();
        
        foreach($this->versions as $version) {
            $d = $version['dimensions'];
            $filename = $id . '-' . $version['name'];
            $target = $this->basePath . '/' . $filename;
            $link = realpath($this->basePath . '/../../../web/image/') . '/' . $filename . '.jpg';
            
            $thumb = clone $img;
            $thumb->cropthumbnailimage($d, $d);
            $thumb->writeimage($target);
            
            symlink($target, $link);
        }
    }

    public function getImageResponse($id, $version = null)
    {
        $path = $this->basePath . '/' . $id;

        if ($version) {
            $path .= '-' . $version;
        }

        if (!is_readable($path)) {
            throw new NotFoundHttpException('Image not found');
        }

        $response = new Response();
        $response->setContent(file_get_contents($path));
        $response->headers->set('Content-type', 'image/jpeg');
        return $response;
    }


}
