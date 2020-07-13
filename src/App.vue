<template>
    <div id="app"
         class="container">
        <div class="columns">
            <div class="column is-2">
                <b-dropdown aria-role="list">
                    <button class="button is-primary"
                            slot="trigger">
                        <span class="d-inline-block">Actions</span>
                        <vue-fontawesome icon="chevron-down"
                                         class="ml-2 cursor-pointer"/>
                    </button>
                    <b-dropdown-item aria-role="listitem"
                                     @click="fireAction(TODO_FILTER_ACTION_SELECTED,TODO_STATUS_COMPLETED)">Mark SELECTED as COMPLETED
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem"
                                     @click="fireAction(TODO_FILTER_ACTION_ALL,TODO_STATUS_ACTIVE)">Mark ALL as ACTIVE
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem"
                                     @click="fireAction(TODO_FILTER_ACTION_ALL,TODO_STATUS_COMPLETED)">Mark ALL as COMPLETED
                    </b-dropdown-item>
                </b-dropdown>
            </div>
            <div class="column is-8">
                <b-field>
                    <b-input placeholder="Type you todo"
                             v-model="text"
                             @keyup.native.esc="clearInput"
                             @keyup.native.enter="onClickAdd"
                             type="text"
                             icon-right="times"
                             icon-right-clickable
                             @icon-right-click="clearText"></b-input>
                </b-field>
            </div>
            <div class="column is-2">
                <button :disabled="canAdd"
                        class="button is-info"
                        @click="onClickAdd">
                    Add
                </button>
            </div>
        </div>
        <hr>
        <div class="list list-wrapper">
            <ul v-if="todoMapped.length"
                class="list-items">
                <li v-for="todo in todoMapped"
                    v-bind:key="todo.id"
                    class="list-item"
                    :class="{'cursor-pointer': !isEditMode && todo.status !== TODO_STATUS_COMPLETED}">
                    <template v-if="!todo.editable">
                        <b-checkbox @input="checked => onClickCheckbox(checked, todo)"
                                    :disabled="isEditMode"
                                    :value="todo.status === TODO_STATUS_COMPLETED"
                                    :type="!todo.checked && (todo.status === TODO_STATUS_COMPLETED)
                        ? 'is-success'
                        : 'is-default'"></b-checkbox>
                        <del v-if="todo.status === TODO_STATUS_COMPLETED">{{todo.text}}
                        </del>
                        <b v-else
                           class="flex-grow-1"
                           @click.self="onClickEdit(todo)">{{todo.text}}</b>
                    </template>
                    <template v-else>
                        <b-input class="flex-grow-1"
                                 @input="value => onChangeEdit(value)"
                                 :value="todo.text"></b-input>
                        <vue-fontawesome @click="onClickEditApply(todo)"
                                         icon="check"
                                         class="ml-2 cursor-pointer"/>
                        <vue-fontawesome @click="onClickEditCancel(todo)"
                                         icon="times"
                                         class="ml-2 cursor-pointer"/>
                    </template>
                </li>
            </ul>
            <i v-else>There are no todo...</i>
        </div>
        <hr>
        <div class="buttons">
            <b-button type="is-light"
                      :disabled="filterStatus === 'all'"
                      @click="setFilter(TODO_FILTER_DEFAULT)">All
            </b-button>
            <b-button type="is-light"
                      :disabled="filterStatus === TODO_STATUS_ACTIVE || !hasActiveTodo"
                      @click="setFilter(TODO_STATUS_ACTIVE)">Active
            </b-button>
            <b-button type="is-light"
                      :disabled="filterStatus === TODO_STATUS_COMPLETED || hasCompletedTodo"
                      @click="setFilter(TODO_STATUS_COMPLETED)">Completed
            </b-button>
            <b-button class="ml-auto"
                      :disabled="hasCompletedTodo"
                      @click="onClickRemove">Remove completed
            </b-button>
        </div>
    </div>
</template>
<script>
    import {
        fetchTodos,
    } from './api/todo/index';

    import {
        TODO_PREFIX,
        TODO_STATUS_ACTIVE,
        TODO_STATUS_COMPLETED,
        TODO_FILTER_ACTION_ALL,
        TODO_FILTER_ACTION_SELECTED,
    } from './constants/todos';

    import {
        uniqueId,
    } from 'lodash';

    const TODO_FILTER_DEFAULT = 'all';

    export default {
        name: 'App',
        data() {
            return {
                text: '',
                textTemp: '',
                todos: [],
                filterStatus: TODO_FILTER_DEFAULT, // all, active, completed,
                TODO_FILTER_DEFAULT,
                TODO_STATUS_ACTIVE,
                TODO_STATUS_COMPLETED,
                TODO_FILTER_ACTION_ALL,
                TODO_FILTER_ACTION_SELECTED,
            }
        },
        computed: {
            canAdd: function () {
                return !this.text;
            },
            isEditMode: function () {
                return this.todos.some(el => el.editable);
            },
            hasActiveTodo: function () {
                return !this.todos.some(el => el.status === this.TODO_FILTER_DEFAULT);
            },
            hasCompletedTodo: function () {
                return !this.todos.some(el => el.status === this.TODO_STATUS_COMPLETED);
            },
            todoMapped: function () {
                const status = this.filterStatus.toLowerCase();
                let newTodos = this.todos;

                if ([this.TODO_STATUS_ACTIVE, this.TODO_STATUS_COMPLETED].some(el => el === status)) {
                    newTodos = this.todos.filter(el => el.status === status);
                }

                return newTodos;
            },
        },
        mounted() {
            fetchTodos()
                .then(({todos}) => {
                    const newTodos = todos.map(el => {
                        el.checked = false;
                        el.selected = false;
                        el.editable = false;
                        return el;
                    });

                    this.todos = newTodos;
                })
                .catch(console.warn)
        },
        methods: {
            clearText() {
                this.text = '';
            },
            getTodoById(todoId) {
                const selectedTodoIndex = this.todos.findIndex(el => el.id === todoId);
                return this.todos[selectedTodoIndex];
            },
            resetTextTemp() {
                this.textTemp = '';
            },
            changeFilterStatus(status) {
                this.filterStatus = status;
            },
            clearInput() {
               this.text = '';
            },
            onClickCheckbox(checked, todo) {
                const selectedTodo = this.getTodoById(todo.id);

                if (checked) {
                    selectedTodo.selected = !selectedTodo.selected;

                    this.todos = [
                        ...this.todos,
                    ];
                }
                else {
                    selectedTodo.status = TODO_STATUS_ACTIVE;
                }
            },
            onClickAdd() {
                this.todos = [
                    {
                        id: uniqueId(TODO_PREFIX),
                        text: this.text,
                        status: this.TODO_STATUS_ACTIVE,
                    },
                    ...this.todos,
                ];
                this.clearInput();
            },
            onClickEdit(todo) {
                if (!this.isEditMode) {
                    const selectedTodo = this.getTodoById(todo.id);
                    selectedTodo.editable = true;
                }
            },
            onChangeEdit(value) {
                this.textTemp = value;
            },
            onClickEditApply(todo) {
                const selectedTodo = this.getTodoById(todo.id);
                selectedTodo.text = this.textTemp;
                selectedTodo.editable = false;

                this.resetTextTemp();
            },
            onClickEditCancel(todo) {
                const selectedTodo = this.getTodoById(todo.id);
                selectedTodo.editable = false;

                this.resetTextTemp();
            },
            onClickRemove() {
                const newTodos = this.todos.filter(el => el.status !== TODO_STATUS_COMPLETED);
                this.todos = [
                    ...newTodos,
                ]
            },
            fireAction(filterAction, actionType) {
                let newTodos = [];
                switch (filterAction) {
                    case TODO_FILTER_ACTION_ALL:

                        newTodos = this.todos.map(el => {
                            el.selected = true;
                            el.status = actionType;
                            return el;
                        });

                        break;
                    case TODO_FILTER_ACTION_SELECTED:

                        newTodos = this.todos.map(el => {
                            if (el.selected) {
                                el.status = TODO_STATUS_COMPLETED;
                                el.selected = false;
                            }
                            return el;
                        });

                        break;
                    default:
                        break;
                }

                this.todos = newTodos;
                this.changeFilterStatus(this.hasActiveTodo
                    ? TODO_FILTER_DEFAULT
                    : TODO_STATUS_COMPLETED);

            },
            setFilter(status = TODO_FILTER_DEFAULT) {
                this.filterStatus = status;
            }
        }
    }
</script>
<style lang="css">
    #app {
        margin: 20px auto;
        max-width: 800px;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .list-wrapper {
        padding: 10px 0;
        height: 370px;
        overflow: auto;
    }

    .list-item {
        display: flex !important;
        align-items: center;
    }

    .flex-grow-1 {
        flex-grow: 1;
    }

    .ml-auto {
        margin-left: auto;
    }

    .ml-2 {
        margin-left: 0.75rem;
    }
</style>