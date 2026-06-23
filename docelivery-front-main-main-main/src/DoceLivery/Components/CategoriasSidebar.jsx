import React from 'react';
import Styles from './CategoriasSidebar.module.css';

const CategoriasSidebar = ({ categories, selectedCategory, onCategorySelect }) => {
    return (
        <aside className={Styles.categories_sidebar}>
            <div className={Styles.sidebar_header}>
                <h3>Categorias Populares</h3>
            </div>
            
            <div className={Styles.categories_list}>
                <button
                    className={`${Styles.category_item} ${selectedCategory === null ? Styles.active : ''}`}
                    onClick={() => onCategorySelect(null)}
                >
                    <span className={Styles.category_icon}>🍰</span>
                    <span className={Styles.category_name}>Todos</span>
                </button>
                
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`${Styles.category_item} ${selectedCategory === category.id ? Styles.active : ''}`}
                        onClick={() => onCategorySelect(category.id)}
                    >
                        <span className={Styles.category_icon}>{category.icon || '🧁'}</span>
                        <span className={Styles.category_name}>{category.name}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default CategoriasSidebar;