import request from '../utils/request';

export function fetchTodoList() {
  return request('http://localhost:3200/api/todo');
}
export function fetchAnotherList() {
  return request('http://localhost:3200/api/another');
}