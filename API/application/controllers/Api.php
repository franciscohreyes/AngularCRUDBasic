<?php
defined('BASEPATH') OR exit('No direct script access allowed');

setlocale(LC_ALL,"es_ES@euro","es_ES","esp");
require APPPATH.'/libraries/REST_Controller.php';

class Api extends REST_Controller {
	/**
	 * __construct
	 */
	public function __construct() {
		/* Access-Control-Allow-Origin CORS */
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
		$method = $_SERVER['REQUEST_METHOD'];
		if($method == "OPTIONS") {
			die();
		}
		parent::__construct();
		$this->load->database('default');
		$this->load->model('Api_db');
		/* config upload image */
		$config = array(
			'upload_path'   => "./assets/image/",
			'allowed_types' => "gif|jpg|png|jpeg",
			'max_width'     => 0,
			'max_height'    => 0,
			'max_size'      => 0,
			'encrypt_name'  => TRUE,
		);
		$this->load->library('upload', $config);
  }
	
	/**
	 * getPeople_get
	 * @method GET
	 */
	public function getPeople_get(){
		$items = $this->Api_db->getPeople();
		if(count($items) >0) {
			$this->response(array('success' => true, 'items' => $items), 200);
		} else {
			$this->response(array('success' => false, 'items' => []), 200);
		}
	}

	/**
	 * saveNewPeople_post
	 * @method POST
	 */
	public function saveNewPeople_post(){
		$data = [
			'name'      => $this->post('name'),
			'email'     => $this->post('email'),
			'phone'     => $this->post('phone'),
			'biography' => $this->post('biography')
		];

		$store = $this->Api_db->savePeople($data);
		if($store["success"] == true){
			/* save new activity action */
			$this->saveNewActivity(array("type" => "create", "message" => "Se agrego un nuevo registro", "user_id" => 1, "people_id" => $store['lastId']));
			$this->response(array('success' => true, 'msg' => "Registro agregado correctamente"), 201);
		} else {
			$this->response(array('success' => false, 'msg' => "error"), 200);
		}
	}

	/**
	 * getPeopleById_get
	 * @method GET
	 */
	public function getPeopleById_get(){
		$people_id = $this->get('people_id');

		$items = $this->Api_db->getPeopleById($people_id);
		if(count($items) >0) {
			$this->response(array('success' => true, 'items' => $items), 200);
		} else {
			$this->response(array('success' => false, 'items' => []), 200);
		}
	}

	/**
	 * updatePeople_post
	 * @method POST
	 */
	public function updatePeople_post(){
		$picture   = "";
		$people_id = $this->post('people_id');
		
		$config = array(
			'upload_path'   => "./assets/image/",
			'allowed_types' => "gif|jpg|png|jpeg",
			'max_width'     => 0,
			'max_height'    => 0,
			'max_size'      => 0,
			'encrypt_name'  => TRUE,
		);
		
		if (!is_dir($config['upload_path'])){
			echo 'invalid dir';
		} else {
			if($this->upload->do_upload('picture')){
				$file_upload = $this->upload->data();
				$picture     = $file_upload['file_name'];

				$data = [
					'name'      => $this->post('name'),
					'email'     => $this->post('email'),
					'phone'     => $this->post('phone'),
					'image'     => $picture,
					'biography' => $this->post('biography')
				];
				$update = $this->Api_db->updatePeopleById($people_id, $data);
				if($update){
					/* save new activity action */
					$this->saveNewActivity(array("type" => "edit", "message" => "Se actualizaron los datos correctamente", "user_id" => 1, "people_id" => $people_id));
					$this->response(array('success' => true, 'msg' => "Registro actualizado correctamente"), 200);
				} else {
					$this->response(array('success' => false, 'msg' => "Ocurrio un error al momento de procesar los datos"), 200);
				}
			} else {
				/* si no llega la imagen, solo los datos del form */
				if($this->upload->do_upload('picture')){
					$file_upload = $this->upload->data();
					$picture     = $file_upload['file_name'];
				}

				$data = [
					'name'      => $this->post('name'),
					'email'     => $this->post('email'),
					'phone'     => $this->post('phone'),
					'image'     => $picture,
					'biography' => $this->post('biography')
				];
				$update = $this->Api_db->updatePeopleById($people_id, $data);
				if($update){
					/* save new activity action */
					$this->saveNewActivity(array("type" => "edit", "message" => "Se añadio un nuevo registro", "user_id" => 1, "people_id" => $people_id));
					$this->response(array('success' => true, 'msg' => "Registro actualizado correctamente"), 200);
				} else {
					$this->response(array('success' => false, 'msg' => "Ocurrio un error al momento de procesar los datos"), 200);
				}
			}
		}
	}

	/**
	 * deletePeopleById_post
	 * @method POST
	 */
	public function deletePeopleById_post(){
		$people_id = $this->post('people_id');
		$data = [
			'status' => 0
		];

		$delete = $this->Api_db->updatePeopleById($people_id, $data);
		if($delete){
			/* save new activity action */
			$this->saveNewActivity(array("type" => "delete", "message" => "Se elimino un registro correctamente", "user_id" => 1, "people_id" => ""));
			$this->response(array('success' => true, 'msg' => "Registro eliminado correctamente"), 200);
		} else {
			$this->response(array('success' => false, 'msg' => "Ocurrio un error al momento de procesar los datos"), 200);
		}
	}

	/**
	 * getActivityFeed_get
	 * @method GET
	 */
	public function getActivityFeed_get(){
		$items = $this->Api_db->getActivity();
		if(count($items) >0) {
			$this->response(array('success' => true, 'items' => $items), 200);
		} else {
			$this->response(array('success' => false, 'items' => []), 200);
		}
	}
	
	/**
	 * save new activity log
	 * saveNewActivity
	 */
	private function saveNewActivity($args=[]){
		$type      = $args['type'];
		$message   = $args['message'];
		$user_id   = $args['user_id'];
		$people_id = ($args['people_id'] != "") ? $args['people_id']: "";

		$data = [
			'type'      => $type,
			'message'   => $message,
			'user_id'   => $user_id,
			'people_id' => $people_id,
			'createdAt' => date('Y-m-d H:i:s'),
			'status'    => 1
		];

		$this->Api_db->saveActivity($data);
	}

	/**
	 * deleteActivityById_post
	 * @method POST
	 */
	public function deleteActivityById_post(){
		$activity_id = $this->post('activity_id');
		$data = [
			'status' => 0
		];

		$delete = $this->Api_db->updateActivity($activity_id, $data);
		if($delete){
			$this->response(array('success' => true, 'msg' => "Registro eliminado correctamente"), 200);
		} else {
			$this->response(array('success' => false, 'msg' => "Ocurrio un error al momento de procesar los datos"), 200);
		}
	}

	/**
	 * getTotal_get
	 * @method GET
	 */
	public function getTotal_get(){
		$type = $this->get('type');
		
		switch($type){
			case "active":
				$total = $this->Api_db->getTotalActive();
				if($total){
					$this->response(array('success' => true, 'items' => $total), 200);
				} else {
					$this->response(array('success' => true, 'items' => 0), 200);
				}
			break;
			case "inactive":
				$total = $this->Api_db->getTotalInactive();
				if($total){
					$this->response(array('success' => true, 'items' => $total), 200);
				} else {
					$this->response(array('success' => true, 'items' => 0), 200);
				}
			break;
		}
	}
}