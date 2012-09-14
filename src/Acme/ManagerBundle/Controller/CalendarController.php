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
    
    public function dataAction($from, $to)
    {
        $date_from =  new \DateTime($from . ' 00:00:00');
        $date_to =  new \DateTime($to . ' 23:59:59');

        //fetch tasks from database
        $tasks = $this->getDoctrine()->getRepository('AcmeManagerBundle:Task')->findBetween($date_from, $date_to);

        //pigeonholing into days
        foreach($tasks as $task) {
            $key = $task->getStart()->format("Y-m-d");
            
            $day_tasks[$key][] = array(
                'description' => $task->getDescription(),
                'startTime' => $task->getStartTime(),
                'duration' => $task->getDuration(),
            );
        }

        $unscheduled = $this->getDoctrine()->getRepository('AcmeManagerBundle:Task')->findUnscheduled();
        foreach($unscheduled as $task) {
            $unscheduled_tasks[] = array(
                'description' => $task->getDescription(),
                'duration' => $task->getDuration(),
            );
        }

        $days = array("unscheduled" => $unscheduled_tasks);

        //building days list depending on given dates range
        $diff = (int)$date_to->diff($date_from)->format('%a');
        $tmp = $date_from;

        for($i = 0; $i <= $diff; $i++) {
            $key = $tmp->format('Y-m-d');
            $days['scheduled'][$key] = array();
            $days['scheduled'][$key]['tasks'] = isset($day_tasks[$key]) ? $day_tasks[$key] : array();
            $tmp->add(new \DateInterval('P1D'));
        }
        
        return new Response(json_encode($days));
    }

    public function saveAction($data) {
        //save data here
    }

}
