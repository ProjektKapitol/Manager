<?php

namespace Acme\ManagerBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Acme\ManagerBundle\Entity\Transaction
 *
 * @ORM\Table(name="trans")
 * @ORM\Entity(repositoryClass="Acme\ManagerBundle\Repository\TransactionRepository")
 */
class Transaction
{
    public static $types = array(0 => 'outcome', 1 => 'income');

    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var smallint $type
     *
     * @ORM\Column(name="type", type="smallint")
     */
    private $type;

    /**
     * @var text $description
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @var integer $value
     *
     * @ORM\Column(name="value", type="integer")
     */
    private $value;

    /**
     * @var datetime $timestampable
     *
     * @ORM\Column(name="timestampable", type="datetime")
     */
    private $timestampable;

    /**
     * @var integer $balance
     *
     * @ORM\Column(name="balance", type="integer")
     */
    private $balance;


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
     * Set amount
     *
     * @param integer $amount
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    /**
     * Get amount
     *
     * @return integer 
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * Set type
     *
     * @param integer $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @return integer 
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set category
     *
     * @param integer $category
     */
    public function setCategory($category)
    {
        $this->category = $category;
    }

    /**
     * Get category
     *
     * @return integer 
     */
    public function getCategory()
    {
        return $this->category;
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
     * Set timestampable
     *
     * @param date $timestampable
     */
    public function setTimestampable($timestampable)
    {
        $this->timestampable = $timestampable;
    }

    /**
     * Get timestampable
     *
     * @return date 
     */
    public function getTimestampable()
    {
        return $this->timestampable;
    }

    /**
     * Set balance
     *
     * @param integer $balance
     */
    public function setBalance($balance)
    {
        $this->balance = $balance;
    }

    /**
     * Get balance
     *
     * @return integer 
     */
    public function getBalance()
    {
        return $this->balance;
    }

    /**
     * Set value
     *
     * @param integer $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * Get value
     *
     * @return integer 
     */
    public function getValue()
    {
        return $this->value;
    }
}