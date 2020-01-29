<template>
   <div class="promo-widget">
		<app-card  customClasses="border-primary">
			<v-layout row wrap>
				<v-flex xl3 lg3 md2 sm3 xs4 b-50>
					<div class="d-custom-flex justify-center align-items-center">
						<img class="img-responsive" alt="comment" src="/static/img/Comments.png" />
					</div>
				</v-flex>
				<v-flex xl9 lg9 md10 sm9 xs8 b-50>
					<div>
						<h4>インパクトレポートの分析でお困りですか？</h4>
						<p class="fs-12 fw-normal grey--text">インパクトレポートを作るのは非常に難しいことです。ロジックモデルの作成、インパクトマップの作成、金銭代理指標の設定等、やることは多岐に渡り、また分析も大変です。私たちは、インパクトレポートの分析のご相談にのれます。お気軽にお申し付けください</p>
						<v-btn color="primary" class="fs-12">{{$t('message.letsGetInTouch')}}</v-btn>
					</div>
				</v-flex>
			</v-layout>
		</app-card>
	</div>
</template>
