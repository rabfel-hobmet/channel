import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";

export default function ChannelNav({ ship, board }) {
  let inactiveClassName =
    "text-2xl font-bold text-link-blue hover:text-link-hover hover:underline";
  let activeClassName = "text-chan-red text-2xl";

  return (
    <ul className="flex md:flex-row flex-col my-3 md:pl-9 divide-x-2">
      <li className="px-3">
        <NavLink
          to={`/board/${ship}/${board}`}
          className={({ isActive }) =>
            !isActive ? inactiveClassName : activeClassName
          }
        >
          /{board}/
        </NavLink>
      </li>
      <li className="px-3">
        <NavLink
          to={`/list/${ship}/${board}`}
          className={({ isActive }) =>
            !isActive ? inactiveClassName : activeClassName
          }
        >
          thread list
        </NavLink>
      </li>
      <li className="px-3">
        <NavLink
          to={`/catalog/${ship}/${board}`}
          className={({ isActive }) =>
            !isActive ? inactiveClassName : activeClassName
          }
        >
          catalog
        </NavLink>
      </li>
      <li className="px-3">
        <a href="/apps/channel/" className={inactiveClassName}>
          home
        </a>{" "}
      </li>
    </ul>
  );
}
