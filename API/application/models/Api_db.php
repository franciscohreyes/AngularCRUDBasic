<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
Class Api_db extends CI_MODEL{
  public function __construct(){
    parent::__construct();
	}
	
	/**
	 * getPeople
	 */
	public function getPeople(){
		$this->db->select('*');
		$this->db->from('people');
		$this->db->where('status = "1"');
		$this->db->order_by('createdAt', 'DESC');
    return $this->db->get()->result();
	}

	/**
	 * savePeople
	 * @param array $data
	 */
	public function savePeople($data){
		$query = $this->db->insert('people', $data);

		if($query){
			$lastId = $this->db->insert_id();
			$response = ["success" => true, "lastId" => $lastId];
			return $response;
		} else {
			return false;
		}
	}

	/**
	 * getPeopleById
	 * @param int $id
	 */
	public function getPeopleById($id){
		$this->db->select('*');
		$this->db->from('people');
		$this->db->where('id', $id);
    return $this->db->get()->result();
	}

	/**
	 * updatePeopleById
	 * @param int $id
	 * @param array $data
	 */
	public function updatePeopleById($id, $data){
		$this->db->where('id', $id);
		$query = $this->db->update('people', $data);

		if($query){
			return true;
		} else {
			return false;
		}
	}

	/**
	 * getActivity
	 */
	public function getActivity(){
		$this->db->select('*', FALSE);
		$this->db->from('activity');
		$this->db->where('status', 1);
		$this->db->order_by('createdAt', 'desc');
    return $this->db->get()->result();
	}

	/**
	 * getTotalActive
	 */
	public function getTotalActive(){
		$this->db->select('count(*) as totalActive', FALSE);
		$this->db->from('people');
		$this->db->where('status', 1);
    return $this->db->get()->result();
	}

	/**
	 * getTotalInactive
	 */
	public function getTotalInactive(){
		$this->db->select('count(*) as totalInactive', FALSE);
		$this->db->from('people');
		$this->db->where('status', 0);
    return $this->db->get()->result();
	}

	/**
	 * saveActivity
	 * @param array $data
	 */
	public function saveActivity($data){
		$query = $this->db->insert('activity', $data);

		if($query){
			return true;
		} else {
			return false;
		}
	}

	/**
	 * updateActivity
	 * @param int $id
	 * @param array $data
	 */
	public function updateActivity($id, $data){
		$this->db->where('id', $id);
		$query = $this->db->update('activity', $data);

		if($query){
			return true;
		} else {
			return false;
		}
	}

}