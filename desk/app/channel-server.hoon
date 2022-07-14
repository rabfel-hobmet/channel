::  /app/channel-server - a distributed chan server
/-  *channel
/+  default-agent, dbug
::
|%
+$  versioned-state
  $%  state-0
  ==
::
+$  state-0
  [%0 =salt =pepa =banned =bounty =boards]
::
+$  card  card:agent:gall
--
::
%-  agent:dbug
::
=|  state-0
=*  state  -
::
^-  agent:gall
=<
  |_  =bowl:gall
  +*  this  .
      moot  ~(. +> bowl)
      def   ~(. (default-agent this %|) bowl)
  ++  on-init
    ^-  (quip card _this)
    %-  (slog leaf+"%chan-server -online" ~)
    =.  bounty  [%.y %planet]                            ::  default, allow only planets
    =.  salt    (~(rad og eny.bowl) (lsh [0 64] 1))      ::  random hasher - but we need a map
    =.  pepa    %-  ~(put by pepa)  :_  our.bowl         ::  a map to back-translate, in secret
                (src-in:moot our.bowl)                   ::  note: salt & pepa are both hidden in dbug scry
    `this
  ::
  ++  on-save
    ^-  vase
    !>(state)
  ::
  ++  on-load
    |=  ole=vase
    ^-  (quip card _this)
    =/  old=versioned-state  !<(versioned-state ole)
    |-
    ?-  -.old
      %0  `this(state old)
    ==
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    ?+    mark  (on-poke:def mark vase)
        %channel-chads
      =/  cad=chads  !<(chads vase)
      =^  cards  state
        ?-  -.cad
          %add-board  (add-board:su-poke:moot name.cad description.cad)
          %del-board  (del-board:su-poke:moot name.cad)
        ::
          %add-admin  (add-admin:su-poke:moot who.cad board.cad)
          %del-admin  (del-admin:su-poke:moot whe.cad board.cad)
        ::
          %ban-users  (ban-users:su-poke:moot whe.cad buard.cad)
          %let-users  (let-users:su-poke:moot whe.cad buard.cad)
          %set-ranks  (set-ranks:su-poke:moot bounty.cad)
        ::
          %ban-words  (ban-words:su-poke:moot which.cad)
          %ban-sites  (ban-sites:su-poke:moot which.cad)
        ::
          %big-notes  (big-notes:su-poke:moot notice.cad board.cad)
        ==
      [cards this]
    ::
        %channel-based
      =/  wat=based  !<(based vase)
      ?-    -.wat
          %add-poast
        ?>  ?&  admit-users-universal:ru:moot
                (admit-users-board:ru:moot board.wat)
            ==
        =.  contents.wat
          (auto-jannie:moot contents.wat)
        ::  todo - banned word parsing
        ::  todo - banned site parsing
        =+  new=(add now.bowl ~s2)
        =+  who=(src-in:moot src.bowl)
        =?    pepa
            !(~(has by pepa) who)
          (~(put by pepa) who src.bowl)
        ?~  maybe-index.wat
          =;  poast=(map index node)
            :_  this
            :~  :^  %pass  /chan/post/(scot %da new)  %agent
                :^  [our.bowl %graph-push-hook]  %poke  %graph-update-3
                !>  ^-  update
                [(add now.bowl ~s2) [%add-nodes [our.bowl board.wat] poast]]
            ==
            ::
          =-  %-  my
              :~  :-  ~[new]
                  :-  [%.y [our.bowl ~[new] new ~ ~ ~]]
                  :-  %graph  %-  my
                  :~
                    :-  2  :_  [%empty ~]
                    [%.y [our.bowl ~[new 2] new ~ ~ ~]]
                  ::
                    :-  1  :_  [%graph -]
                    [%.y [our.bowl ~[new 1] new ~ ~ ~]] 
                  ==
              ==
          %-  my 
          :~  :-  1 
              :_  [%empty ~]
              :-  %.y
              [who ~[new 1 1] new [[%text (scot %da new)] contents.wat] ~ ~]
          ==
          ::
        =;  poast=(map index node)
          :_  this
          :~  :^  %pass  /chan/post/(scot %da new)  %agent
              :^  [our.bowl %graph-store]  %poke  %graph-update-3
              !>  ^-  update
              [new [%add-nodes [our.bowl board.wat] poast]]
          ==
        %-  my
        :~  :-  ~[-.u.maybe-index.wat 2 new]
            :_  [%empty ~]
            [%.y [our.bowl ~[-.u.maybe-index.wat 2 new] new ~ ~ ~]]
          ::
            :-  ~[-.u.maybe-index.wat 2 new 1]
            :_  [%empty ~]
            [%.y [who ~[-.u.maybe-index.wat 2 new 1] new contents.wat ~ ~]]
        ==
      ==
    ==
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    ?+    wire  (on-agent:def wire sign)
        [%chan %fw @ @ ~]
      ?.  ?=(%fact -.sign)  `this
      ?+    p.cage.sign  (on-agent:def wire sign)
        %thread-done  `this
      ::
          %thread-fail
        =+  err=!<((pair term tang) q.cage.sign)
        %.  `this
        (slog leaf+"%chan-server-fail -graph-delete {(trip p.err)}" q.err)
      ==
    ::
        [%chan %sw @ @ ~]
      ?.  ?=(%fact -.sign)  `this
      ?+    p.cage.sign  (on-agent:def wire sign)
        %thread-done  `this
      ::
          %thread-fail
        =+  err=!<((pair term tang) q.cage.sign)
        %.  `this
        (slog leaf+"%chan-server-fail -group-delete {(trip p.err)}" q.err)
      ==
    ::
        [%chan %metas @ @ ~]
      ?.  ?=(%poke-ack -.sign)  `this
      ~_  leaf+"%chan-server-fail -maybe-failed-to-create-board"
      ?>  =(~ p.sign)
      :_  this
      :~  :^  %give  %fact  [srv-pat:moot ~]
          [%channel-moggs !>(`moggs`[%hav-boards ~(key by boards)])]
      ==
    ==
  ::
  ++  on-peek
    |=  =path
    ^-  (unit (unit cage))
    ?+    path  (on-peek:def path)
        [%x %dbug %state ~]
      ``[%state !>([%0 bounty=bounty boards=boards banned=banned])]
    ::
        [%x %boards ~]
      =,  enjs:format
      :^  ~  ~  %json
      !>  ^-  json
      %+  frond  'boards'
      %-  pairs
      %+  turn  ~(tap by boards)
      |=  [b=@t r=^ adm=(set @p) ban=(set @p)]
      :-  b  %-  pairs
      :~  admins+a+(turn ~(tap in adm) |=(@p s+(scot %p +<)))
          banned+a+(turn ~(tap in ban) |=(@p s+(scot %p +<)))
      ==
    ::
        [%x %banned-users ~]
      =,  enjs:format
      =-  ``json+!>(`json`(frond 'banned-users' -))
      a+(turn ~(tap in users.banned) |=(@p s+(scot %p +<)))
    ==
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    ?+    path  (on-watch:def path)
        [%website ~]
      :_  this
      [%give %fact ~ json+!>(all-out)]~
    ::
        [%chan %server @ ~]
      ?>  =(our.bowl (slav %p +>-.path))
      =?    pepa
          !(~(has by pepa) (src-in:moot src.bowl))
        (~(put by pepa) (src-in:moot src.bowl) src.bowl)
      :_  this
      =-  [%give %fact ~ %channel-moggs -]~
      !>(`moggs`[%hav-boards ~(key by boards)])
    ==
  ::
  ++  on-leave
    |=  =path
    ?.  ?=([%chan %server @ ~] path)    `this
    ?.  =(our.bowl (scot %p +>-.path))  `this
    =+  ah=~(tap in ~(key by boards))
    |-  ?~  ah  `this
    =+  cur=(~(got by boards) i.ah)
    %=    $
      ah  t.ah
    ::
        boards
      (~(put by boards) i.ah cur(adm (~(del in adm.cur) src.bowl)))
    ==
  ++  on-arvo   on-arvo:def
  ++  on-fail   on-fail:def
  --
|_  bol=bowl:gall
++  srv-pat
  /chan/server/(scot %p our.bol)
::
++  src-in
  |=  p=@p
  ^-  @p
  (rsh 7 (shas salt p))
::
++  src-out
  |=  p=@p
  ^-  @p
  ~_  leaf+"%chan-server-fail -unknown-ship"
  (need (~(get by pepa) p))
::
++  grinder
  ^-  (map @p @p)
  %-  ~(rep by pepa)
  |=  [[a=@p b=@p] q=(map @p @p)]
  (~(put by q) b a)
::
++  all-out
  =,  enjs:format
  |^
  %-  pairs
  :~  banned-users+a+(turn ~(tap in users.banned) |=(@p s+(scot %p +<)))
      banned-words+a+(turn ~(tap in words.banned) |=(@t s++<))
      banned-sites+a+(turn ~(tap in sites.banned) |=(@t s++<))
    ::
      bounty+(pairs ~[only+b+only.bounty which+s+which.bounty])
      boards+(pairs (turn ~(tap by boards) board-maker))
  ==
  ::
  ++  board-maker
    |=  [b=@tas [r=resource adm=(set @p) ban=(set @p)]]
    ^-  [@t json]
    :-  b
    %-  pairs
    :~  admins+a+(turn ~(tap in adm) |=(@p s+(scot %p +<)))
        banned+a+(turn ~(tap in ban) |=(@p s+(scot %p +<)))
    ==
  --
::
  ++  auto-jannie
    |=  lc=(list content)
    ^-  (list content)
    =;  roody-poo=(list @t)
      %+  turn  lc
      |=  c=content
      ?.  ?=(%text -.c)  c
      =/  cancel=(list tape)
        %~  tap  in  ^-  (set tape)
        (~(run in words.banned) |=(@t (cass (trip +<))))
      =+  review=(trip +.c)
      =+  preview=(cass (trip +.c))
      =+  rng=~(. og eny.bol)
      |-
      ?~  cancel  [%text (crip review)]
      ?~  maybe-start=(find i.cancel preview)  $(cancel t.cancel)
      =+  penis=(rads:rng (lent roody-poo))
      =/  replace=@t
        (snag -.penis roody-poo)
      %=    $
          rng
        +.penis
      ::
          review
        %+  into
          (oust [(need maybe-start) (lent i.cancel)] `tape`review)
        [(need maybe-start) replace]
      ::
          preview
        %+  into
          (oust [(need maybe-start) (lent i.cancel)] `tape`preview)
        [(need maybe-start) replace]
      ==
      ::
    :~  'roody-poo'
        'sigourney'
        'PENIS'
        'candy-ass'
        'VAGINA'
        'peanut butter'
        'bring back'
        'grinman'
        'triscuits'
        'is a meme'
        'ǫ̸̧͍̤̱̼̹̋̐̔̊̎̀n̶̙͍̻̭̩̰̞̱̘͊̀̂́ ̴̨̪͇̠͕̩̦̲̯͎͖̣͚̻̈́̊̅͑̂͛̈́͌̌͝u̵̝͛̅͗͑͒͐̈́̀͝r̶̘͍̖̹̘̟̰̱̥͔̙̜͇̠̿͜b̸̲̦̬͙͖̗̲͙̲̑̉́̄͝i̸̡̮̱͚̾͂̋̒̉̐̀́͐͠͝t̵̯͖͈͈͚̜̭̳̮̊́͂̾̑̽̆́͗͜͠ ̷̗̙̬͓̃͗̇͒̍͠n̴̻̬̜̙̩̠̞͚̹͙̻͠o̴̡̥̻̪̻͎̱̼̜̻͈̥̓͛̀͗̃̉̊͗̅̋̈́̔̐̕͝ ̵̰̥͇͚̦͔̱̻̤̮͈̗͕̩͗͆̄̃̉͂̄̒̀̈́ŏ̷̢̢̡̡̨͖̪̩̰̰̣͍̈́̇̍̾̽̽̈́n̷̫̹̙̝̥͒̇̿̐̋͆̆̕ͅḙ̸͓͙͗̿̄̉͆́̌̇͊̿̓́͘̚̕ ̷̢̣̫̫̘̞̪͈͕̗̥͂́̿͗̆̈́č̶̨̼͈̪̦͕̤̣͇͙̬͈̤̺̏͊͆͑̃ḁ̷̡̳̽̉̆n̶̦̥̱͎̉̉̈́̒̃̐̈́̽ ̸̢͓̙̣̺̠̳̭̌̀͐̊͑̇̽͆̈̓̆͗̚͜h̸͓͚̩̹̠̼̳̿̋͋͒͛e̸̡̧̨̡̧͍͎̲͕̯̯͎̞̬̻̐̌͂̽͐̌͘͝͠͝á̴̧̫̥͇͍͈̰̜̰͊̈̾̽̅̕̚͝r̴̨̛̛͈͓̜̳̺̤̘̺̼͙̀̈́̅͑̀̍̀́͘̚͝ ̴̡̢̰̼̺̐͊͑̒̕͝ͅỳ̶̩̝̭̞̣̦̰̜͓͠͝ͅò̸̢̜̦̰̥̭͖͂͌̀̋́̊̊͘̚̚͝u̴̧̦̻̜̔͐̊̐̉̈̈́͒͘ ̷̢̨̹̘͕̓͌̎͐s̵̨̫̄̑͠ͅç̶͖̦͍̹̣̦̬̳͓̙͍̞͊̈́́̌̚ŗ̶̞͈̲͚͊̌́̍̌͛̕͝e̵̖̪̼̻̦̦͔̤̦̲̖̳̜͗̋̂̓̆̇̿́͐̎͜͠͠ā̶̻͔̟͒̋̋̆͑͒͋͘̕m̴̧̟̦͈̒̋'
    ==
::
++  ru
  |%
  ++  graph-path
    ^-  path
    /(scot %p our.bol)/graph-store/(scot %da now.bol)
  ++  graph-keys
    ^-  resources
    =;  act=action
      ~_  leaf+"%chan-server-fail -got-strange-graph-keys"
      ?>  ?=(%keys -.act)
      resources.act
    q:.^(update %gx (welp graph-path [%keys %noun ~]))
  ::
  ++  group-path
    ^-  path
    /(scot %p our.bol)/group-store/(scot %da now.bol)
  ++  group-keys
    ^-  resources
    .^(resources %gy (welp group-path [%groups ~]))
  ::
  ++  admit-super
    ^-  ?
    (team:title our.bol src.bol)
  ++  admit-users-universal
    ^-  ?
    ?|  !(~(has in users.banned) src.bol)
        admit-super
        admit-boba
    ==
  ++  admit-admin
    |=  b=@tas
    ^-  ?
    ?~  deet=(~(get by boards) b)
      ~_(leaf+"%chan-server-fail -user-{<src.bol>}-fake-admin" !!)
    ?|((~(has in adm.u.deet) src.bol) admit-super)
  ++  admit-users-board
    |=  b=@tas
    ^-  ?
    ?~  deet=(~(get by boards) b)
      ~_(leaf+"%chan-server-fail -user-requests-non-extant-board" !!)
    ?|(!(~(has in ban.u.deet) src.bol) admit-super)
  ++  admit-boba
    ?:  only.bounty
      ?-  which.bounty
        %galaxy  ?=(%czar (clan:title src.bol))
        %star    ?=(%king (clan:title src.bol))
        %planet  ?=(%duke (clan:title src.bol))
        %moon    ?=(%earl (clan:title src.bol))
        %comet   ?=(%pawn (clan:title src.bol))
      ==
    ?-  which.bounty
      %galaxy  (~(has in (sy ~[%czar])) (clan:title src.bol))
      %star    (~(has in (sy ~[%czar %king])) (clan:title src.bol))
      %planet  (~(has in (sy ~[%czar %king %duke])) (clan:title src.bol))
      %moon    (~(has in (sy ~[%czar %king %duke %earl])) (clan:title src.bol))
      %comet   (~(has in (sy ~[%czar %king %duke %earl %pawn])) (clan:title src.bol))
    ==
  --
++  biz
  |%
  ++  bobas
    ^-  [ban=(set rank:title) alo=(set rank:title)]
    ;;  [(set rank:title) (set rank:title)]
    ?:  only.bounty
      ?-  which.bounty
        %galaxy  [(sy ~[%king %duke %earl %pawn]) (sy ~[%czar])]
        %star    [(sy ~[%czar %duke %earl %pawn]) (sy ~[%king])]
        %planet  [(sy ~[%czar %king %earl %pawn]) (sy ~[%duke])]
        %moon    [(sy ~[%czar %king %duke %pawn]) (sy ~[%earl])]
        %comet   [(sy ~[%czar %king %duke %earl]) (sy ~[%pawn])]
      ==
    ?-  which.bounty
      %galaxy  [(sy ~[%king %duke %earl %pawn]) (sy ~[%czar])]
      %star    [(sy ~[%duke %earl %pawn]) (sy ~[%czar %king])]
      %planet  [(sy ~[%earl %pawn]) (sy ~[%czar %king %duke])]
      %moon    [(sy ~[%pawn]) (sy ~[%czar %king %duke %earl])]
      %comet         [~ (sy ~[%czar %king %duke %earl %pawn])]
    ==
  ::
  ++  graph
    |=  n=term
    ^-  card
    :^  %pass  /chan/store/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %graph-store]  %poke  %graph-update-3
    !>  ^-  update 
    :-  now.bol
    [%add-graph [our.bol n] ~ `%graph-validator-publish %.y]
  ::
  ++  pushy
    |=  [n=term a=term]
    ^-  card
    :^  %pass  /chan/push/[n]/[a]/(scot %da now.bol)  %agent
    [[our.bol a] %poke %push-hook-action !>(`pew-act`[%add our.bol n])]
  ::
  ++  group
    |=  n=term
    ^-  card
    :^  %pass  /chan/grops/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %group-store]  %poke  %group-action
    !>(`gro-act`[%add-group [our.bol n] [%open ~ ~] %.y])
  ::
  ++  joins
    |=  n=term
    ^-  card
    :^  %pass  /chan/grops/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %group-store]  %poke  %group-action
    !>(`gro-act`[%add-members [our.bol n] (sy ~[our.bol])])
  ::
  ++  write
    |=  n=term
    ^-  card
    :^  %pass  /chan/only-me/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %group-store]  %poke  %group-action
    !>  ^-  gro-act
    :+  %add-tag  [our.bol n]
    [[%graph [our.bol n] %writers] (sy ~[our.bol])]
  ::
  ++  metas
    |=  [n=term d=@t]
    ^-  card
    :^  %pass  /chan/metas/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %metadata-store]  %poke  %metadata-update-2
    !>  ^-  met-act
    :^  %add  [our.bol n]  [%graph [our.bol n]]
    [`@t`n d 0x0 now.bol our.bol [%graph %publish] '' %.n %.n %$]
  ::
  ++  ranks
    |=  [n=term q=?]
    ^-  card
    =/  dif=diff
      [%open ?:(q [%allow-ranks alo:bobas] [%ban-ranks ban:bobas])]
    :+  %pass  /chan/gro-ran/[n]/(scot %tas n)/(scot %da now.bol)
    :^  %agent  [our.bol %group-store]  %poke
    :-  %group-action
    !>(`gro-act`[%change-policy [our.bol n] dif])
  ::
  ++  ships
    |=  [n=term we=(set @p) q=?]
    ^-  card
    =.  we  (~(del in we) our.bol)
    =/  dif=diff
      [%open ?:(q [%allow-ships we] [%ban-ships we])]
    :+  %pass  /chan/gro-shi/[n]/(scot %tas n)/(scot %da now.bol)
    :^  %agent  [our.bol %group-store]  %poke
    [%group-action !>(`gro-act`[%change-policy [our.bol n] dif])]
  ::
  ++  close
    |=  n=term
    ^-  (list card)
    =/  tids  ~(. og eny.bol)
    =^  gra  tids  (rads:tids 777)
    =^  gro  tids  (rads:tids 777)
    =/  sips
      :-  :^  ~  `(cat 3 n gra)  byk.bol(r da+now.bol)
          [%graph-delete !>(`[~ gra-vew]``[%delete [our.bol n]])]
      :^  ~  `(cat 3 n gro)  byk.bol(r da+now.bol)
      [%group-delete !>(`[~ gro-vew]``[%remove [our.bol n]])]
      ::
    :~  :^  %pass  /chan/fw/[n]/(scot %ud gra)  %agent
        [[our.bol %spider] %watch /thread-result/[(cat 3 n gra)]]
      ::
        :^  %pass  /chan/sw/[n]/(scot %ud gro)  %agent
        [[our.bol %spider] %watch /thread-result/[(cat 3 n gro)]]
      ::
        :^  %pass  /chan/fp/[n]/(scot %ud gra)  %agent
        [[our.bol %spider] %poke %spider-start !>(-.sips)]
      ::
        :^  %pass  /chan/sp/[n]/(scot %ud gro)  %agent
        [[our.bol %spider] %poke %spider-start !>(+.sips)]
    ==
  --
++  su-poke
  |%
  ++  add-board
    |=  [b=@tas d=@t]
    ^-  (quip card _state)
    ?>  admit-super:ru
    ~_  leaf+"%chan-server-fail -name-pre-exists"
    ?<  ?|  (~(has in graph-keys:ru) [our.bol b])
            (~(has in group-keys:ru) [our.bol b])
            (~(has by boards) b)
        ==
    :_  state(boards (~(put by boards) b [[our.bol b] ~ ~]))
    :~  (graph:biz b)  (pushy:biz b %graph-push-hook)
        (pushy:biz b %metadata-push-hook) 
        (pushy:biz b %contact-push-hook)
        (group:biz b)  (joins:biz b)
        (pushy:biz b %group-push-hook)
        (write:biz b)  (metas:biz b d)  (ranks:biz b %.n)
      ::
        :^  %give  %fact  ~[/website]
        json+!>((pairs:enjs:format ~[add-board+s+b description+s+d]))
      ::
        :^  %pass  /admin/self  %agent
        :+  [our.bol %channel-server]  %poke
        [%channel-chads !>(`chads`[%add-admin (src-in our.bol) b])]
    ==
  ::
  ++  del-board
    |=  b=@tas
    ^-  (quip card _state)
    ?>  admit-super:ru
    ~_  leaf+"%chan-server-fail -board-not-found"
    ?>  ?&  (~(has in graph-keys:ru) [our.bol b])
            (~(has in group-keys:ru) [our.bol b])
            (~(has by boards) b)
        ==
    :_  state(boards (~(del by boards) b))
    %+  welp  (close:biz b)
    :~  :^  %give  %fact  ~[srv-pat]
        [%channel-moggs !>(`moggs`[%del-boards b])]
        :^  %give  %fact  ~[/website]
        json+!>((frond:enjs:format 'del-board' s+b))
    ==
  ::
  ++  add-admin
    |=  [w=@p b=@tas]
    ^-  (quip card _state)
    ?>  (admit-admin:ru b)
    ?~  cur=(~(get by boards) b)
      ~_(leaf+"%chan-server-fail -board-not-found" !!)
    =+  comet-me=(src-in w)
    =?    pepa
        !(~(has by pepa) comet-me)
      (~(put by pepa) comet-me w)
    =.  boards
      (~(put by boards) b u.cur(adm (~(put in adm.u.cur) w)))
    :_  state
    :~  :^  %give  %fact  ~[/chan/server/(scot %p our.bol)]
        =-  channel-moggs+!>(`moggs`-)
        [%new-admins b (~(put in adm.u.cur) w)]
      ::
        :^  %give  %fact  ~[/website]
        =-  json+!>((frond:enjs:format 'add-admin' -))
        (pairs:enjs:format ~[admin+s+(scot %p w) board+s+b])
    ==
  ::
  ++  del-admin
    |=  [we=(set @p) b=@tas]
    ^-  (quip card _state)
    ?>  (admit-admin:ru b)
    ?~  cur=(~(get by boards) b)  
      ~_(leaf+"%chan-server-fail -board-not-found" !!)
    =/  secret-we=(set @p)
      (sy (murn ~(tap in we) |=(@p (~(get by pepa) +<))))
    =.  boards
      %+  ~(put by boards)  b
      u.cur(adm (~(dif in adm.u.cur) secret-we))
    :_  state
    :~  :^  %give  %fact  ~[/chan/server/(scot %p our.bol)]
        channel-moggs+!>(`moggs`[%not-admins b secret-we])
      ::
        :^  %give  %fact  ~[/website]
        =-  json+!>((frond:enjs:format 'del-admin' -))
        %-  pairs:enjs:format
        :~  board+s+b
            admin+a+(turn ~(tap in we) |=(@p s+(scot %p +<)))
        ==
    ==
  ::
  ++  ban-users
    |=  [we=(set @p) bu=(unit @tas)]
    ^-  (quip card _state)
    =/  secret-we=(set @p)
      (sy (murn ~(tap in we) |=(@p (~(get by pepa) +<))))
    ?~  bu  
      ?>  admit-super:ru
      :_  state(users.banned (~(uni in users.banned) we))
      :_  (turn ~(tap in ~(key by boards)) (curr ships:biz [secret-we %.n]))
      :^  %give  %fact  ~[/website]
      =-  json+!>((frond:enjs:format 'site-ban' -))
      a+(turn ~(tap in we) |=(@p s+(scot %p +<)))
    ?~  bord=(~(get by boards) u.bu)
      ~_(leaf+"%chan-server-fail -users-not-found" !!)
    ?>  (admit-admin:ru u.bu)
    =.  u.bord
      [res.u.bord (~(dif in adm.u.bord) we) (~(uni in ban.u.bord) we)]
    :_  state(boards (~(put by boards) u.bu u.bord))
    :~  (ships:biz u.bu secret-we %.n)
        :^  %give  %fact  ~[/website]
        =-  json+!>((frond:enjs:format 'board-ban' -))
        %-  pairs:enjs:format
        :~  board+s+u.bu
            banned+a+(turn ~(tap in we) |=(@p s+(scot %p +<)))
        ==
    ==
  ++  let-users
    |=  [we=(set @p) bu=(unit @tas)]
    ^-  (quip card _state)
    =/  secret-we=(set @p)
      (sy (murn ~(tap in we) |=(@p (~(get by pepa) +<))))
    ?~  bu
      ?>  admit-super:ru
      :_  state(users.banned (~(dif in users.banned) we))
      ?~  ~(tap in we)
        (turn ~(tap in ~(key by boards)) (curr ships:biz [secret-we %.n]))
      :_  (turn ~(tap in ~(key by boards)) (curr ships:biz [secret-we %.n]))
      :^  %give  %fact  ~[/website]
      =-  json+!>((frond:enjs:format 'site-allow' -))
      a+(turn ~(tap in we) |=(@p s+(scot %p +<)))
    ?~  bord=(~(get by boards) u.bu)
      ~_(leaf+"%chan-server-fail -users-not-found'" !!)
    ?>  (admit-admin:ru u.bu)
    =.  u.bord
      [res.u.bord (~(dif in adm.u.bord) we) (~(uni in ban.u.bord) we)]
    :_  state(boards (~(put by boards) u.bu u.bord))
    :~  (ships:biz u.bu secret-we %.y)
        :^  %give  %fact  ~[/website]
        =-  json+!>((frond:enjs:format 'board-allow' -))
        %-  pairs:enjs:format
        :~  board+s+u.bu
            banned+a+(turn ~(tap in we) |=(@p s+(scot %p +<)))
        ==
    ==
  ++  set-ranks
    |=  bo=^bounty
    ^-  (quip card _state)
    ?>  admit-super:ru
    :_  state(bounty bo)
    :_  %+  welp
          (turn ~(tap in ~(key by boards)) (curr ranks:biz(bounty bo) %.y))
        (turn ~(tap in ~(key by boards)) (curr ranks:biz(bounty bo) %.n))
    :^  %give  %fact  ~[/website]
    json+!>((pairs:enjs:format ~[only+b+only.bounty which+s+which.bounty]))
  ++  ban-words
    |=  wc=(set cord)
    ^-  (quip card _state)
    ?>  admit-super:ru
    =;  roody-poo=(set cord)
      =.  banned
        banned(words (~(uni in words.banned) (~(dif in wc) roody-poo)))
      `state
    %-  sy
    :~  'roody-poo'
        'sigourney'
        'PENIS'
        'candy-ass'
        'VAGINA'
        'peanut butter'
        'bring back'
        'grinman'
        'triscuits'
        'is a meme'
        'ǫ̸̧͍̤̱̼̹̋̐̔̊̎̀n̶̙͍̻̭̩̰̞̱̘͊̀̂́ ̴̨̪͇̠͕̩̦̲̯͎͖̣͚̻̈́̊̅͑̂͛̈́͌̌͝u̵̝͛̅͗͑͒͐̈́̀͝r̶̘͍̖̹̘̟̰̱̥͔̙̜͇̠̿͜b̸̲̦̬͙͖̗̲͙̲̑̉́̄͝i̸̡̮̱͚̾͂̋̒̉̐̀́͐͠͝t̵̯͖͈͈͚̜̭̳̮̊́͂̾̑̽̆́͗͜͠ ̷̗̙̬͓̃͗̇͒̍͠n̴̻̬̜̙̩̠̞͚̹͙̻͠o̴̡̥̻̪̻͎̱̼̜̻͈̥̓͛̀͗̃̉̊͗̅̋̈́̔̐̕͝ ̵̰̥͇͚̦͔̱̻̤̮͈̗͕̩͗͆̄̃̉͂̄̒̀̈́ŏ̷̢̢̡̡̨͖̪̩̰̰̣͍̈́̇̍̾̽̽̈́n̷̫̹̙̝̥͒̇̿̐̋͆̆̕ͅḙ̸͓͙͗̿̄̉͆́̌̇͊̿̓́͘̚̕ ̷̢̣̫̫̘̞̪͈͕̗̥͂́̿͗̆̈́č̶̨̼͈̪̦͕̤̣͇͙̬͈̤̺̏͊͆͑̃ḁ̷̡̳̽̉̆n̶̦̥̱͎̉̉̈́̒̃̐̈́̽ ̸̢͓̙̣̺̠̳̭̌̀͐̊͑̇̽͆̈̓̆͗̚͜h̸͓͚̩̹̠̼̳̿̋͋͒͛e̸̡̧̨̡̧͍͎̲͕̯̯͎̞̬̻̐̌͂̽͐̌͘͝͠͝á̴̧̫̥͇͍͈̰̜̰͊̈̾̽̅̕̚͝r̴̨̛̛͈͓̜̳̺̤̘̺̼͙̀̈́̅͑̀̍̀́͘̚͝ ̴̡̢̰̼̺̐͊͑̒̕͝ͅỳ̶̩̝̭̞̣̦̰̜͓͠͝ͅò̸̢̜̦̰̥̭͖͂͌̀̋́̊̊͘̚̚͝u̴̧̦̻̜̔͐̊̐̉̈̈́͒͘ ̷̢̨̹̘͕̓͌̎͐s̵̨̫̄̑͠ͅç̶͖̦͍̹̣̦̬̳͓̙͍̞͊̈́́̌̚ŗ̶̞͈̲͚͊̌́̍̌͛̕͝e̵̖̪̼̻̦̦͔̤̦̲̖̳̜͗̋̂̓̆̇̿́͐̎͜͠͠ā̶̻͔̟͒̋̋̆͑͒͋͘̕m̴̧̟̦͈̒̋'
    ==
  ++  ban-sites
    |=  wc=(set cord)
    ^-  (quip card _state)
    ?>  admit-super:ru
    `state
  ++  big-notes
    |=  [no=@t b=@tas]
    ^-  (quip card _state)
    ?>  (admit-admin:ru b)
    :_  state
    :~  :^  %give  %fact  [/chan/server/(scot %p our.bol) ~]
        [%channel-moggs !>(`moggs`[%big-notice now.bol b no (src-in src.bol)])]
    ==
  --
--
  