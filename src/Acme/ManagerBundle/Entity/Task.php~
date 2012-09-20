<?php

namespace Acme\ManagerBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Acme\ManagerBundle\Entity\Task
 *
 * @ORM\Table(name="task")
 * @ORM\Entity(repositoryClass="Acme\ManagerBundle\Repository\TaskRepository")
 */
class Task
{
    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    
     /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="tasks")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;
    
    /**
     * @var smallint $is_done
     *
     * @ORM\Column(name="is_done", type="smallint")
     */
    private $is_done;
    
    /**
     * @var integer $duration
     *
     * @ORM\Column(name="start", type="datetime", nullable="true")
     */
    private $start;
    
    /**
     * @var integer $duration
     *
     * @ORM\Column(name="duration", type="integer")
     */
    private $duration;

    /**
     * @var text $description
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set is_done
     *
     * @param smallint $isDone
     */
    public function setIsDone($isDone)
    {
        $this->is_done = $isDone;
    }

    /**
     * Get is_done
     *
     * @return smallint 
     */
    public function getIsDone()
    {
        return $this->is_done;
    }

    /**
     * Set start
     *
     * @param date $start
     */
    public function setStart($start)
    {
        $this->start = $start;
    }

    /**
     * Get start
     *
     * @return date 
     */
    public function getStart()
    {
        return $this->start;
    }

    /**
     * Set duration
     *
     * @param integer $duration
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    /**
     * Get duration
     *
     * @return integer 
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set description
     *
     * @param text $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * Get description
     *
     * @return text 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set user
     *
     * @param Acme\ManagerBundle\Entity\User $user
     */
    public function setUser(\Acme\ManagerBundle\Entity\User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return Acme\ManagerBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }
    
    public function getStartTime()
    {
        $d =  $this->getStart();
        return array('y' => $d->format("Y"), 'm' => $d->format("m"), 'd' => $d->format("d"), 'h' => $d->format("H"), 'i' => $d->format("i"));
    }
}