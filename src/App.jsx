import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import Scrollbars from 'react-custom-scrollbars';
import uuid from 'uuid/dist/v4'

const itemsFromBackend = [
    {id: uuid(), content: 'First Task: Set up firebase config..'},
    {id: uuid(), content: 'Second Task: Set up firestore'},
    {id: uuid(), content: 'Third Task: set up state management'},
    {id: uuid(), content: 'Fourth Task: '},
]

const columnsFromBackend = {
        [uuid()]: {
            name: 'Requested',
            items: itemsFromBackend
        },
        [uuid()]: {
            name: 'Todo',
            items: []
        },
        [uuid()]: {
            name: 'In Progress',
            items: []
        },
        [uuid()]: {
            name: 'Completed',
            items: []
        },
        
    }

    const onDragEnd = (result, columns, setColumns) => {
        if(!result.destination) return;
        const {source, destination} = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            })
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items]
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId] : {
                    ...column,
                    items: copiedItems
                }
            })
            }
        
    }

function App() {
    const [columns, setColumns] = useState(columnsFromBackend)
  return (
    <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>
        <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
            {Object.entries(columns).map(([id, column]) => {
                return (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 8}}>
                        <h2>{column.name}</h2>
                        <Droppable droppableId={id} key={id}>
                            {(provided, snapshot) => {
                                return (
                                    //<Scrollbars style={{width: '270px', backgroundColor: 'white', maxHeight: 500, borderRadius: '8px'}}>
                                        <div {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{
                                                    background: snapshot.isDraggingOver ? 'lightgrey' : 'white',
                                                    padding: 4,
                                                    width:250,
                                                    minHeight: 260,
                                                    maxHeight: 500,
                                                    overflowY: 'scroll', 
                                                    paddingRight: '17px',
                                                    boxSizing: 'content-box',
                                                    //borderRadius: '8px' 
                                                    }} >
                                                        {column.items.map((item, index) => {
                                                            return (
                                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                    {(provided, snapshot) => {
                                                                        return (
                                                                            <div 
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{userSelect: 'none',
                                                                                    padding: 16,
                                                                                    margin: '0 0 8px 0',
                                                                                    backgroundColor: snapshot.isDragging ? '#00a8f3' : '#263B4A',
                                                                                    boxShadow: snapshot.isDragging ? '5px 5px 5px 0px rgba(0,0,0,0.33)' : 'none',
                                                                                    color: 'white',
                                                                                    borderRadius: '8px',
                                                                                    ...provided.draggableProps.style}}>
                                                                                        {item.content}
                                                                            </div>
                                                                        )
                                                                    }}
                                                                </Draggable>
                                                            )
                                                        })}
                                                        {provided.placeholder}
                                                        <button style={{marginLeft: '160px'}}>Add Item</button>
                                                </div>

                                    //</Scrollbars>
                                )
                            }}
                        </Droppable>
                    </div>
                )
            })}
        </DragDropContext>
     
    </div>
  );
}

export default App;
