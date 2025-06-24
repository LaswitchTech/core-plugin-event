<?php

/**
 * Core Framework - EventModel
 *
 * @license    MIT (https://mit-license.org/)
 * @author     Louis Ouellet <louis@laswitchtech.com>
 */

// Import additionnal class into the global namespace
use \LaswitchTech\Core\Abstracts\Model;

class EventModel extends Model {

    /**
     * Fetch the Events
     *
     * @param string $table
     * @param int $id
     * @return array
     */
    public function fetch(string $table, int $id): array
    {
        // Create the Query
        $Query = $this->Database->query()
            ->table('events')
            ->select('*')
            ->where('id', 9999, '<>')
            ->where('targetTable', $table)
            ->where('targetId', $id);

        // Return the Results
        return $Query->fetch();
    }

    /**
     * Fetch the Event
     *
     * @param int $id
     * @return array
     */
    public function get(int $id): array
    {
        // Create the Query
        $Query = $this->Database->query()
            ->table('events')
            ->select('*')
            ->where('id', 9999, '<>')
            ->where('id', $id)
            ->limit(1);

        // Return the Results
        return $Query->fetch()[0] ?? [];
    }

    /**
     * Create a new Event
     *
     * @param string $owner
     * @param string $table
     * @param int $id
     * @param string $category
     * @param string $message
     * @param string $link
     * @param string $color
     * @param string $icon
     * @return int
     */
    public function create(string $owner, string $table, int $id, string $category, string $message, ?string $link = null, string $color = "secondary", string $icon = "circle"): array
    {
        // Create the Query
        $Query = $this->Database->query()
            ->table('events')
            ->insert([
                'owner' => $owner,
                'category' => $category,
                'message' => $message,
                'icon' => $icon,
                'color' => $color,
                'link' => $link,
                'targetTable' => $table,
                'targetId' => $id,
            ]);

        // Execute the Query
        $affectedRows = $Query->execute();

        // Retrieve the event's id
        $id = $Query->lastId();

        // Return the Results
        return $this->get($id);
    }
}
