import todoArray from '../../_moch/todos';

export const fetchTodos = () => {
  return new Promise((resolve)=>{
      setTimeout(()=>{
          resolve({todos: todoArray});
      }, 500)
  })
};