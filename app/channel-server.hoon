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
  ++  on-save
    ^-  vase
    !>(state)
  ++  on-load
    |=  ole=vase
    =/  old=versioned-state  !<(versioned-state ole)
    |-
    ?-  -.old
      %0  `this(state old)
    ==
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
          %ban-words  (ban-words:su-poke:moot which.cad board.cad)
          %ban-sites  (ban-sites:su-poke:moot which.cad board.cad)
        ::
          %big-notes  (big-notes:su-poke:moot notice.cad board.cad)
        ==
      [cards this]
    ::
        %channel-based
      =/  wat=based  !<(based vase)
      ?-    -.wat
          %add-poast
        ?>  &(admit-users-universal:ru:moot (admit-users-board:ru:moot board.wat))
        ::  todo - banned word parsing
        ::  todo - banned site parsing
        `this
          %del-poast  `this
      ==
    ==
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
        %.  `this
        (slog leaf+"%chan-server-fail -graph-delete-{<+>-.wire>}" ~)
      ==
    ::
        [%chan %fp @ @ ~]
      ?.  ?=(%fact -.sign)  `this
      ?+    p.cage.sign  (on-agent:def wire sign)
        %thread-done  `this
      ::
          %thread-fail
        %.  `this
        (slog leaf+"%chan-server-fail -group-delete-{<+>-.wire>}-wrap" ~)
      ==
    ::
        [%chan %metas @ @ ~]
      ?.  ?=(%poke-ack -.sign)  `this
      ~|  '%chan-server-fail -maybe-failed-to-create-board'
      ?>  =(~ p.sign)
      :_  this
      :~  :^  %give  %fact  [srv-pat:moot ~]
          [%channel-moggs !>(`moggs`[%hav-boards ~(key by boards)])]
      ==
    ==
  ++  on-peek
    |=  =path
    ^-  (unit (unit cage))
    ?+    path  (on-peek:def path)
        [%x %dbug %state ~]
      ``[%state !>([%0 bounty=bounty boards=boards banned=banned])]
    ==
  ++  on-arvo   on-arvo:def
  ++  on-fail   on-fail:def
  ++  on-leave  on-leave:def
  ++  on-watch  on-watch:def
  --
|_  bol=bowl:gall
++  src-in
  |=  p=@p
  ^-  @p
  (rsh 7 (shas salt p))
++  src-out
  |=  p=@p
  ^-  @p
  ~|  '%chan-server-fail -unknown-ship'
  (need (~(get by pepa) p))
++  srv-pat
  /chan/server/(scot %p our.bol)
++  ru
  |%
  ++  graph-path
    /(scot %p our.bol)/graph-store/(scot %da now.bol)
  ++  graph-keys
    ^-  resources
    =;  act=action
      ~|  '%chan-server-fail -got-strange-graph-keys'
      ?>  ?=(%keys -.act)
      resources.act
    q:.^(update %gx (welp graph-path [%keys %noun ~]))
  ::
  ++  group-path
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
    |(!(~(has in users.banned) src.bol) admit-super)
  ++  admit-admin
    |=  b=@tas
    ^-  ?  ~|  "%chan-server-fail -user-{<src.bol>}-fake-admin"
    ?|((~(has in adm:(~(got by boards) b)) src.bol) admit-super)
  ++  admit-users-board
    |=  b=@tas
    ^-  ?  ~|  '%chan-server-fail -user-requests-non-extant-board'
    ?|((~(has in ban:(~(got by boards) b)) src.bol) admit-super)
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
    [%add-graph [our.bol n] ~ `%graph-validator-publish %.n]
  ::
  ++  group
    |=  n=term
    ^-  card
    :^  %pass  /chan/grops/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %group-store]  %poke  %group-action
    !>(`gro-act`[%add-group [our.bol (cat 3 n '-wrap')] [%open ~ ~] %.y])
  ::
  ++  joins
    |=  n=term
    ^-  card
    :^  %pass  /chan/grops/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %group-store]  %poke  %group-action
    !>(`gro-act`[%add-members [our.bol (cat 3 n '-wrap')] (sy ~[our.bol])])
  ::
  ++  write
    |=  n=term
    ^-  card
    :^  %pass  /chan/only-me/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %group-store]  %poke  %group-action
    !>  ^-  gro-act
    [%add-tag [our.bol (cat 3 n '-wrap')] [%graph [our.bol n] %writers] (sy ~[our.bol])]
  ::
  ++  metas
    |=  [n=term d=@t]
    ^-  card
    :^  %pass  /chan/metas/[n]/(scot %da now.bol)  %agent
    :^  [our.bol %metadata-store]  %poke  %metadata-update-2
    !>  ^-  met-act
    :^  %add  [our.bol (cat 3 n '-wrap')]  [%graph [our.bol n]]
    [`@t`n d 0x0 now.bol our.bol [%graph %publish] '' %.n %.n %$]
  ::
  ++  ranks
    |=  [n=term q=?]
    ^-  card
    =/  dif=diff
      [%open ?:(q [%allow-ranks alo:bobas] [%ban-ranks ban:bobas])]
    :+  %pass  /chan/gro-ran/[n]/(scot %tas n)/(scot %da now.bol)
    :^  %agent  [our.bol %group-store]  %poke
    [%group-action !>(`gro-act`[%change-policy [our.bol (cat 3 n '-wrap')] dif])]
  ::
  ++  ships
    |=  [n=term we=(set @p) q=?]
    ^-  card
    =.  we  (~(del in we) our.bol)
    =/  dif=diff
      [%open ?:(q [%allow-ships we] [%ban-ships we])]
    :+  %pass  /chan/gro-shi/[n]/(scot %tas n)/(scot %da now.bol)
    :^  %agent  [our.bol %group-push-hook]  %poke
    [%group-action !>(`gro-act`[%change-policy [our.bol n] dif])]
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
      [%group-delete !>(`[~ gro-vew]``[%remove [our.bol (cat 3 n '-wrap')]])]
    :~  :^  %pass  /chan/fw/[n]/(scot %ud gra)  %agent
        [[our.bol %spider] %watch /thread-result/[gra]]
      ::
        :^  %pass  /chan/sw/[n]/(scot %ud gro)  %agent
        [[our.bol %spider] %watch /thread-result/[gro]]
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
    ~|  '%chan-server-fail -name-pre-exists'
    ?<  ?|  (~(has in graph-keys:ru) [our.bol b])
            (~(has in group-keys:ru) [our.bol b])
            (~(has by boards) b)
        ==
    :_  state(boards (~(put by boards) b [[our.bol b] ~ ~]))
    :~  (graph:biz b)  (group:biz b)    (joins:biz b)
        (write:biz b)  (metas:biz b d)  (ranks:biz b %.n)
    ==
  ::
  ++  del-board
    |=  b=@tas
    ^-  (quip card _state)
    ?>  admit-super:ru
    ~|  '%chan-server-fail -board-not-found'
    ?>  ?&  (~(has in graph-keys:ru) [our.bol b])
            (~(has in group-keys:ru) [our.bol (cat 3 b '-wrap')])
            (~(has by boards) b)
        ==
    :_  state(boards (~(del by boards) b))
    :_  (close:biz b)
    :^  %give  %fact  ~[srv-pat]
    [%channel-moggs !>(`moggs`[%del-boards b])]
  ::
  ++  add-admin
    |=  [w=@p b=@tas]
    ^-  (quip card _state)
    ?>  (admit-admin:ru b)
    ~|  '%chan-server-fail -board-not-found'
    ?~  cur=(~(get by boards) b)  !!
    `state(boards (~(put by boards) b u.cur(adm (~(put in adm.u.cur) w))))
  ++  del-admin
    |=  [we=(set @p) b=@tas]
    ^-  (quip card _state)
    ?>  (admit-admin:ru b)
    ~|  '%chan-server-fail -board-not-found'
    ?>  (~(has by boards) b)
    =+  cur=(~(got by boards) b)
    `state(boards (~(put by boards) b cur(adm (~(dif in adm.cur) we))))
  ++  ban-users
    |=  [we=(set @p) bu=(unit @tas)]
    ^-  (quip card _state)
    ?~  bu  
      ?>  admit-super:ru
      `state(users.banned (~(uni in users.banned) we))
    ~|  '%chan-server-fail -users-not-found'
    ?~  bord=(~(get by boards) u.bu)  !!
    ?>  (admit-admin:ru u.bu)
    =.  u.bord
      [res.u.bord (~(dif in adm.u.bord) we) (~(uni in ban.u.bord) we)]
    :-  [(ships:biz u.bu we %.n) ~]
    state(boards (~(put by boards) u.bu u.bord))
  ++  let-users
    |=  [we=(set @p) bu=(unit @tas)]
    ^-  (quip card _state)
    ?~  bu
      ?>  admit-super:ru
      :-  (turn ~(tap in ~(key by boards)) (curr ships:biz [we %.n]))
      state(users.banned (~(dif in users.banned) we))
    ~|  '%chan-server-fail -users-not-found'
    ?~  bord=(~(get by boards) u.bu)  !!
    ?>  (admit-admin:ru u.bu)
    =.  u.bord
      [res.u.bord (~(dif in adm.u.bord) we) (~(uni in ban.u.bord) we)]
    :-  ~[(ships:biz u.bu we %.n)]
    state(boards (~(put by boards) u.bu u.bord))
  ++  set-ranks
    |=  bo=^bounty
    ^-  (quip card _state)
    ?>  admit-super:ru
    :_  state
    %+  welp  (turn ~(tap in ~(key by boards)) (curr ranks:biz %.y))
    (turn ~(tap in ~(key by boards)) (curr ranks:biz %.n))
  ++  ban-words
    |=  [wc=(set cord) b=@tas]
    ^-  (quip card _state)
    ?>  admit-super:ru
    `state
  ++  ban-sites
    |=  [wc=(set cord) b=@tas]
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
  