import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

const initialMenuItems = [
    { id: 1, category: 'buuz', title: 'Уламжлалт Бууз', description: 'Гараар татсан үхрийн махтай, шүүслэг амттай уламжлалт монгол бууз.', price: 15000, image: '/images/buuz.png', tags: ['Best Seller', 'Traditional'] },
    { id: 2, category: 'khuushuur', title: 'Мантуун Хуушуур', description: 'Амтлаг үхрийн махтай, шаржигнасан гадна талтай монгол хуушуур.', price: 12000, image: '/images/khuushuur.png', tags: ['Crispy', 'Classic'] },
    { id: 3, category: 'burger', title: 'Chef Special Burger', description: 'Дээд зэрэглэлийн үхрийн мах, бяслаг, тусгай соусаар амталсан бургер.', price: 22000, image: '/images/burger.png', tags: ['Premium', 'Huge'] },
    { id: 4, category: 'pizza', title: 'Margherita Pizza', description: 'Шинэхэн моцарелла бяслаг, томат соус болон базил навчтай итали пицца.', price: 35000, image: '/images/pizza.png', tags: ['No Meat', 'Fresh'] },
    { id: 5, category: 'sushi', title: 'Premium Sushi Box', description: 'Салмон, туна болон шинэхэн ногоотой 12 ширхэгтэй суши багц.', price: 45000, image: '/images/sushi.png', tags: ['Luxury', 'Sea Food'] },
];

const initialCategories = [
    { id: 'all', name: 'Бүгд', icon: '🍽️' },
    { id: 'buuz', name: 'Бууз', icon: '/images/buuz.png' },
    { id: 'khuushuur', name: 'Хуушуур', icon: '/images/khuushuur.png' },
    { id: 'burger', name: 'Бургер', icon: '/images/burger.png' },
    { id: 'pizza', name: 'Пицца', icon: '/images/pizza.png' },
    { id: 'sushi', name: 'Суши', icon: '/images/sushi.png' },
];

export const MenuProvider = ({ children }) => {
    const [menuItems, setMenuItems] = useState(() => {
        const saved = localStorage.getItem('menuItems');
        return saved ? JSON.parse(saved) : initialMenuItems;
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : initialCategories;
    });

    useEffect(() => {
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }, [menuItems]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(),
            image: product.image || '/images/burger.png', // Fallback image
            tags: product.tags ? product.tags.split(',').map(tag => tag.trim()) : ['New']
        };
        setMenuItems([...menuItems, newProduct]);
    };

    const deleteProduct = (id) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const addCategory = (category) => {
        const newCategory = {
            id: category.id || `cat_${Date.now()}`,
            name: category.name,
            icon: category.icon || '🍽️'
        };
        setCategories([...categories, newCategory]);
    };

    const deleteCategory = (id) => {
        if (id === 'all') return; // Cannot delete the "All" category
        setCategories(categories.filter(cat => cat.id !== id));
    };

    return (
        <MenuContext.Provider value={{
            menuItems, addProduct, deleteProduct,
            categories, addCategory, deleteCategory
        }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => useContext(MenuContext);
