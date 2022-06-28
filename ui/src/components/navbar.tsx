import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

export default function ChannelNav({ship, board}) {
    let inactiveClassName = "text-2xl font-bold text-link-blue hover:text-link-hover hover:underline";
    let activeClassName = "text-chan-red text-2xl";

    return (
    <ul className="flex my-3 pl-9 divide-x-2">
        <li className='px-3'><NavLink to={`/board/${ship}/${board}`} className={({ isActive }) => (!isActive ? inactiveClassName : activeClassName)}>/{board}/</NavLink></li>
        <li className='px-3'><NavLink to={`/list/${ship}/${board}`} className={({ isActive }) => (!isActive ? inactiveClassName : activeClassName)}>thread list</NavLink></li>
        <li className='px-3'><h2 className="text-link-blue text-2xl">catalog</h2> </li>
        <li className='px-3'><NavLink to="/" className={inactiveClassName}>home</NavLink> </li>
    </ul>
    )
}