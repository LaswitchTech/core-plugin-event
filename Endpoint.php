<?php

// Import additionnal class into the global namespace
use \LaswitchTech\Core\Abstracts\Endpoint;

class EventEndpoint extends BaseEndpoint {

    /**
     * Constructor
     */
    public function __construct()
    {

        // Call Parent Constructor
        parent::__construct();

        // Initialize the Endpoint
        $this->init('event');

        // Set Properties
        $this->required = [];
    }

    /**
     * Delete a record
     */
    public function deleteAction(): array
    {
        // Set the default message
        $message = ["status" => 200, "message" => "OK", "data" => []];

        // Retrieve the record
        $record = $this->Model->{$this->name}->fetch(intval($this->Request->getParams('GET','id')));

        // Check if the record is accessible
        if(empty($record)){
            $message = ["status" => 404, "message" => "Not Found", "data" => "Could not find the requested ".$this->name."."];
        } else {
            // Check if the organization owns the record
            if(array_key_exists('organization',$record) && $record['organization']['id'] != $this->Auth->user()->organization()->id){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to access this ".$this->name."."];
            }
            // Check if the user is authorized to access the record
            if(array_key_exists('assignedTo',$record) && $record['assignedTo']['id'] != $this->Auth->user()->id && !$this->Auth->isAuthorized("AccountManager", 1)){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to access this ".$this->name."."];
            }
        }

        // Check if the record is accessible
        if($message['status'] == 200){

            // Check the request method
            if($this->Request->getMethod() == "GET"){

                // Delete the record
                $affectedRows = $this->Model->{$this->name}->delete($record['id']);

                // Check if the record was deleted
                if($affectedRows){

                    // Retrieve the record
                    $message['data']['record'] = $record;
                } else {
                    $message = ["status" => 500, "message" => "Internal Server Error", "data" => "An error occurred while deleting the ".$this->name."."];
                }
            } else {
                $message = ["status" => 405, "message" => "Method Not Allowed", "data" => "The method is not allowed for the requested URL."];
            }
        }

        // Return the message
        return $message;
    }
}
