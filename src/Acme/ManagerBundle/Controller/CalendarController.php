<?php

namespace Acme\ManagerBundle\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Acme\ManagerBundle\Entity\Task;

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

    public function saveAction(Request $request) {
        $em = $this->getDoctrine()->getEntityManager();

        $data = $request->request->all();
        $data = (array)json_decode($data["d"]);
        $ret = "";
        foreach ((array)$data['scheduled'] as $date => $day) {
            $day = (array)$day;
            $date_from =  new \DateTime((string)$date . ' 00:00:00');
            $date_to =  new \DateTime((string)$date . ' 23:59:59');

            //delete tasks for given day
            $old = $this->getDoctrine()->getRepository('AcmeManagerBundle:Task')
                ->findBetween($date_from, $date_to);

            foreach ($old as $t) {
                $em->remove($t);
            }

            $em->flush();

            foreach ($day['tasks'] as $k => $t) {
                $t = (array)$t;
                $ret = print_r($t, true);
                $task = new Task;
                $task->setIsDone(0);
                $task->setDescription($t["description"]);
                $task->setDuration($t["duration"]);
                $st = (array)$t["startTime"];
                $h = sprintf("%02d", $st["h"]);
                $i = sprintf("%02d", $st["i"]);
                $m = sprintf("%02d", $st["m"]);
                $d = sprintf("%02d", $st["d"]);
                $y = $st["y"];
                $task->setStart(new \DateTime($y . "-" . $m . "-" . $d . " " . $h . ":" . $i. ":00"));

                $em->persist($task);
            }
            $em->flush();
        }

        return new Response($ret);
    }

}
