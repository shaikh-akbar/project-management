import React, { useState, useEffect } from 'react';
import './TrelloManagement.css';

function TrelloManagement() {
    const [columns, setColumns] = useState(() => {
        const storedColumns = localStorage.getItem('columns');
        return storedColumns ? JSON.parse(storedColumns) : [
            {
                id: 1,
                title: 'To Do',
                cards: [
                    { id: 'card-1', title: 'Task 1', description: 'Description for Task 1' },
                    { id: 'card-2', title: 'Task 2', description: 'Description for Task 2' }
                ]
            },
            {
                id: 2,
                title: 'In Progress',
                cards: [
                    { id: 'card-3', title: 'Task 3', description: 'Description for Task 3' }
                ]
            },
            {
                id: 3,
                title: 'Done',
                cards: [
                    { id: 'card-4', title: 'Task 4', description: 'Description for Task 4' }
                ]
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(columns));
    }, [columns]);

    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);

    const handleAddCard = () => {
        if (!newCardTitle.match(/^[a-zA-Z\s]*$/) || newCardTitle.trim() === '') {
            alert('Title should contain only alphabets and cannot be empty.');
            return;
        }
        if (newCardDescription.trim().length < 25) {
            alert('Description should be at least 25 characters long.');
            return;
        }

        if (selectedCard) {
            const updatedColumns = [...columns];
            const columnIndex = updatedColumns.findIndex(col => col.cards.some(card => card.id === selectedCard.id));
            const cardIndex = updatedColumns[columnIndex].cards.findIndex(card => card.id === selectedCard.id);
            updatedColumns[columnIndex].cards[cardIndex] = {
                ...selectedCard,
                title: newCardTitle,
                description: newCardDescription
            };
            setColumns(updatedColumns);
        } else {
            const updatedColumns = [...columns];
            updatedColumns[selectedColumnIndex].cards.push({
                id: `card-${Date.now()}`,
                title: newCardTitle,
                description: newCardDescription
            });
            setColumns(updatedColumns);
        }

        setNewCardTitle('');
        setNewCardDescription('');
        setSelectedCard(null);
        setShowModal(false);
    };

    const handleEditCard = (card) => {
        setSelectedCard(card);
        setNewCardTitle(card.title);
        setNewCardDescription(card.description);
        setShowModal(true);
    };

    const handleDeleteCard = (cardId) => {
        const updatedColumns = columns.map(col => ({
            ...col,
            cards: col.cards.filter(card => card.id !== cardId)
        }));
        setColumns(updatedColumns);
    };

    const handleDragStart = (e, cardId) => {
        e.dataTransfer.setData('text/plain', cardId);
    };

    const handleDrop = (e, columnIndex) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        console.log("Card ID:", cardId);
        console.log("Updated Columns:", columns);
    
        console.log("Check the Card ID:", cardId === '1714371905847');
    
        console.log("Verify Updated Columns:", columns);
    
        console.log("Card IDs in each column:");
        columns.forEach((column) => {
            console.log(column.title);
            column.cards.forEach((card) => {
                console.log(card.id);
            });
        });
    
        const foundColumn = columns.find((col) => col.cards.some((c) => c.id === cardId));
        console.log("Found Column:", foundColumn);
    
        if (!foundColumn) {
            console.error("Column not found for card ID:", cardId);
            return;
        }
    
        console.log("Inspect Found Column:", foundColumn);
    
        const card = foundColumn.cards.find((c) => c.id === cardId);
    
        console.log("Comparing with card ID:", cardId);
        console.log("Found Column:", foundColumn);
    
        if (!columns[columnIndex]) return;
    
        const newColumns = columns.map((col, index) => {
            if (index !== columnIndex && col.cards.some((c) => c.id === cardId)) {
                col.cards = col.cards.filter((c) => c.id !== cardId);
            }
            return col;
        });
    
        newColumns[columnIndex].cards.push(card);
        console.log("New Columns:", newColumns);
        setColumns(newColumns);
    };
    
    
    
    
    
    
    
    
    
    
    

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleAddCardClick = () => {
        setNewCardTitle('');
        setNewCardDescription('');
        setSelectedCard(null);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="col" onDrop={(e) => handleDrop(e, columnIndex)} onDragOver={(e) => handleDragOver(e)}>
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <span className="column-title">{column.title}</span>
                                <button className="btn btn-primary" onClick={handleAddCardClick}>Add Card</button>
                            </div>
                            <div className="card-body">
                                {column.cards.map((card, cardIndex) => (
                                    <div key={card.id} className="card mb-3" draggable onDragStart={(e) => handleDragStart(e, card.id)}>
                                        <div className="card-body">
                                            <h5 className="card-title">{card.title}</h5>
                                            <p className="card-text">{card.description}</p>
                                            <div className="btn-changes">
                                                <button className="btn btn-info" onClick={() => handleEditCard(card)}>Edit</button>
                                                <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal fade show" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedCard ? 'Edit Card' : 'Add Card'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newCardTitle}
                                            onChange={(e) => setNewCardTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            className="form-control"
                                            value={newCardDescription}
                                            onChange={(e) => setNewCardDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Select Column</label>
                                        <select
                                            className="form-control"
                                            value={selectedColumnIndex}
                                            onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                                        >
                                            {columns.map((column, index) => (
                                                <option key={column.id} value={index} className='option'>{column.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="btn-changes">
                                        <button type="button" className="btn btn-primary" onClick={handleAddCard}>{selectedCard ? 'Save Changes' : 'Add Card'}</button>
                                        {selectedCard && <button type="button" className="btn btn-danger ml-2" onClick={() => handleDeleteCard(selectedCard.id)}>Delete Card</button>}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrelloManagement;













