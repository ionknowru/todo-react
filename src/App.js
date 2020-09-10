import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { List, AddList, Tasks } from './components';

const App = () => {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3030/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setLists(data);
    });
    axios.get('http://localhost:3030/colors').then(({ data }) => {
      setColors(data);
    })
  }, []);

  const onAddList = obj => {
    const newList = [...lists, obj];
    setLists(newList);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newList);
  };

  const onEditListTitle = (id, title) => {
    const newList = lists.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List items={[
          {
            icon: (<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15px" height="15px"><path d="M0 11H24V13H0zM0 2H24V4H0zM0 20H24V22H0z"/></svg>),
            name: 'Все задачи',
          },
        ]}
        />

        {lists ?  (
          <List items={lists} 
                onRemove={id => {
                  const newLists = lists.filter(item => item.id !== id);
                  setLists(newLists);
                }} 
                onClickItem={item => {
                  setActiveItem(item);
                }}
                activeItem={activeItem}
                isRemovable 
          />
          ) : (
            'Загрузка'
          )}

        <AddList onAdd={onAddList} colors={colors} />
      </div>

      <div className="todo__tasks">
        {lists && 
          activeItem && 
            <Tasks list={activeItem} 
                   onEditTitle={onEditListTitle}
                   onAddTask={onAddTask}
            />}
      </div>
    </div>
  );
}

export default App;