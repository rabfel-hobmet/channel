::
::  /sur/channel
::
/-  store=graph-store,
    views=graph-view,
    metas=metadata-store,
    grops=group-store,
    grews=group-view,
    group,
    three=s3
::^?
|%
::
::  s3 stuff
::
++  credentials    credentials:three
++  configuration  configuration:three
::
::  graph stuff
::
++  index      index:store
++  update     update:store
++  action     action:store
++  gra-vew    action:views
++  content    content:store
++  resource   resource:store
++  resources  resources:store
::
::  metas stuff
::
++  met-act  action:metas
::
::  group stuff
::
++  diff     diff:policy:group
++  gro-act  action:grops
++  gro-vew  action:grews
::
::  server state
::
+$  salt  @ud
+$  pepa  (map @p @p)
::
+$  banned  [users=(set @p) words=(set @t) sites=(set @t)]
::
+$  bounty  [only=? which=shug]
+$  shug  ?(%galaxy %star %planet %moon %comet)
::
+$  boards  (map @tas [res=resource adm=(set @p) ban=(set @p)])
::
::  chad - server actions
::
+$  chads
  $%  [%add-board name=@tas description=@t]              ::  add a board with a description
      [%del-board name=@tas]                             ::  completely delete a group and tell everyone else to, too
    ::
      [%add-admin who=@p board=@tas]                     ::  add a single admin to a board
      [%del-admin whe=(set @p) board=@tas]               ::  remove a group of admins from a board
    ::
      [%ban-users whe=(set @p) buard=(unit @tas)]        ::  ban users on some or all boards
      [%let-users whe=(set @p) buard=(unit @tas)]        ::  re-permit users on some or all boards
      [%set-ranks =bounty]
    ::
      [%ban-words which=(set cord) board=@tas]           ::  this will require parsing all content, but could maybe be done in frontend?
      [%ban-sites which=(set cord) board=@tas]           ::  ban linking to some urls? also done in front end?
    ::
      [%big-notes notice=@t board=@tas]                  ::  send a notice to users
  ==
::
::  mogging - server hints
::
+$  moggs
  $%  [%hav-boards boards=(set @tas)]                    ::  fact update, available boards
      [%del-boards boards=@tas]                          ::  fact update, remove boards
      [%big-notice =@da board=@tas notice=@t admin=@p]   ::  a server-side warning or notice
      [%new-admins board=@tas who=(set @p)]              ::  you're an admin, OP!
      [%not-admins board=@tas who=(set @p)]              ::  you're not an admin, stacy
  ==
::
::  client state
::
+$  chans  (jug @p [board=@tas admin=?])
+$  notes  (jug @p [=index board=@tas notice=@t admin=@p])
::
::  client -> server actions
::
+$  based
  $%  [%del-poast =index board=@tas]                     ::  remove a poast, comment on a board
      $:  %add-poast                                     ::  a comment, poast (if index, poast)
          maybe-index=(unit index)
          contents=(list content)
          board=@tas
      ==
  ==
::
::  stacy - poaster actions
::
::
+$  stacy
  $%  [%see-hoast ship=@p]                               ::  subscribe to host
      [%new-poast message=@t board=@tas]                 ::  become OP
      [%del-poast =index board=@tas]                     ::  remove a poast, comment on a board
      [%ack-notes notes=(set @da)]                       ::  acknowledge a server notice
    ::
      $:  %lol-whats                                     ::  OP... lolwut?
          parent=index
          message=@t
          board=@tas
      ==
  ==
--