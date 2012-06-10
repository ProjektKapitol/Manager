<?php

namespace Acme\ManagerBundle\Controller;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class CalendarController extends Controller
{
    var $numOfDays = 3;
    
    public function indexAction()
    {
        return $this->render('AcmeManagerBundle:Calendar:index.html.twig');
    }
    
    public function daysDataAction($year, $month, $day)
    {
        $tasks = $this->getDoctrine()->getRepository('AcmeManagerBundle:Task')->findAll();
        
        foreach($tasks as $task) {
            $key = $task->getStart()->format("Y-m-d");
            
            $day_tasks[$key][] = array(
                'description' => $task->getDescription(),
                'startTime' => $task->getStartTime(),
                'duration' => $task->getDuration(),
            );
        }
        
        $days = array();
        
        $date = new \DateTime($year . '-' . $month . '-' . $day);
        
        for($i = 0; $i < $this->numOfDays; $i++) {
            $key = $date->format('Y-m-d');
            $days[$key] = array();
            $date->add(new \DateInterval('P1D'));
            $days[$key]['tasks'] = isset($day_tasks[$key]) ? $day_tasks[$key] : array();
        }
        
        return new Response(json_encode(array(
            "view" => "days",
            "data" => $days,
        )));
    }

}
