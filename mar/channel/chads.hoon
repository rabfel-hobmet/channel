::
::  /mar/channel/chads
::
/-  *channel
|_  dudes=chads
++  grad  %noun
++  grow
  |%
  ++  noun  dudes
  --
++  grab
  |%
  ++  noun  chads
  ++  json
    |=  jon=^json
    %-  chads
    =<  (bro-noun jon)
    |%
    ++  bro-noun
      =,  dejs:format
      %-  of
      :~  [%add-board (ot ~[['name' (se %tas)] ['description' so]])]
          [%del-board (se %tas)]
        ::
          [%add-admin (ot ~[['who' (se %p)] ['board' (se %tas)]])]
          [%del-admin (ot ~[['whe' (as (se %p))] ['board' (se %tas)]])]
        ::
          [%set-ranks bo (se %tas)]
          :-  %let-users
          (ot ~[['whe' (as (se %p))] ['buard' (su:dejs-soft:format sym)]])
          :-  %ban-users
          (ot ~[['whe' (as (se %p))] ['buard' (su:dejs-soft:format sym)]])
        ::
          [%ban-words (ot ~[['which' (as so)] ['board' (se %tas)]])]
          [%ban-sites (ot ~[['which' (as so)] ['board' (se %tas)]])]
        ::
          [%big-notes (ot ~[['notice' so] ['board' (se %tas)]])]
      ==
    --
  --
--