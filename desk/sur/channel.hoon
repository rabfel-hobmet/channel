::
::  /sur/channel
::
/-  store=graph-store,
    views=graph-view,
    metas=metadata-store,
    grops=group-store,
    grews=group-view,
    group,
    pushi=push-hook,
    three=s3
/+  *mip
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
++  node       node:store
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
::  push-hook stuff
::
++  pew-act  action:pushi
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
      [%big-notice id=@da board=@tas notice=@t admin=@p] ::  a server-side warning or notice
      [%new-admins board=@tas who=(set @p)]              ::  you're an admin, OP!
      [%not-admins board=@tas who=(set @p)]              ::  you're not an admin, stacy
  ==
::
::  client state
::
+$  chans
::  mip ship, board, settings
  (mip @p @tas [admin=? notes=(map index=@da [notice=@t admin=@p])])
::
::  client -> server actions
::
+$  based
  $%  $:  %add-poast                                     ::  a comment, poast (if index, comment)
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
      [%bye-hoast ship=@p]                               ::  leave a host
      [%ack-notes note=(set @da) ship=@p board=@tas]     ::  acknowledge a server notice
    ::
      $:  %add-poast                                     ::  a comment, poast (if index, comment)
          maybe-index=(unit index)
          image=(unit @t)
          message=(list content)
          ship=@p
          board=@tas
      ==
  ==
--