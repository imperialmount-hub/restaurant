import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from './firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';

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
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState(initialCategories);

    // Listen to menuItems from Firestore
    useEffect(() => {
        const q = query(collection(db, 'menuItems'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMenuItems(items.length > 0 ? items : initialMenuItems);
        });
        return () => unsubscribe();
    }, []);

    // Listen to categories from Firestore
    useEffect(() => {
        const q = query(collection(db, 'categories'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Ensure "All" category is always at the start if not in DB
            const finalCats = cats.length > 0 ? cats : initialCategories;
            if (!finalCats.find(c => c.id === 'all')) {
                finalCats.unshift(initialCategories[0]);
            }
            setCategories(finalCats);
        });
        return () => unsubscribe();
    }, []);

    const addProduct = async (product) => {
        try {
            const newProduct = {
                ...product,
                image: product.image || '/images/burger.png',
                tags: product.tags ? product.tags.split(',').map(tag => tag.trim()) : ['New'],
                createdAt: Date.now()
            };
            await addDoc(collection(db, 'menuItems'), newProduct);
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'menuItems', id));
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            const productRef = doc(db, 'menuItems', id);
            await updateDoc(productRef, {
                ...updatedProduct,
                tags: typeof updatedProduct.tags === 'string' ? updatedProduct.tags.split(',').map(tag => tag.trim()) : updatedProduct.tags,
                updatedAt: Date.now()
            });
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };

    const addCategory = async (category) => {
        try {
            const newCat = {
                name: category.name,
                icon: category.icon || '🍽️',
                id: category.id // User provided ID
            };
            // Note: If using user-provided ID as document ID:
            // await setDoc(doc(db, 'categories', category.id), newCat);
            // But let's use addDoc for simplicity or consistency if prefered.
            await addDoc(collection(db, 'categories'), newCat);
        } catch (error) {
            console.error("Error adding category: ", error);
        }
    };

    const deleteCategory = async (id) => {
        if (id === 'all') return;
        try {
            await deleteDoc(doc(db, 'categories', id));
        } catch (error) {
            console.error("Error deleting category: ", error);
        }
    };

    return (
        <MenuContext.Provider value={{
            menuItems, addProduct, deleteProduct, updateProduct,
            categories, addCategory, deleteCategory
        }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => useContext(MenuContext);
