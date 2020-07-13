import {
    uniqueId,
} from 'lodash';

import {
    TODO_PREFIX,
} from '../constants/todos';

const todoArray = [
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 1',
        status: 'active', // active, completed
    },
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 2',
        status: 'completed', // active, completed
    },
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 3',
        status: 'completed', // active, completed
    },
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 4',
        status: 'active', // active, completed
    },
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 5',
        status: 'active', // active, completed
    },
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 6',
        status: 'active', // active, completed
    },
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 7',
        status: 'active', // active, completed
    },
    {
        id: uniqueId(TODO_PREFIX),
        text: 'Task number 8',
        status: 'active', // active, completed
    },
];

export default todoArray;